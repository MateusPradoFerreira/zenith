import { PllMockRestService, PllPaginatedResponse, PllRecordRepository, PllRecordState } from "@pollaris";
import { Schedule } from "../../models/schedule.model";
import { GetAllScheduleByFilterParams, GetAllScheduleByFilterResponse, ScheduleService } from "../schedule.service";
import { delay, map, Observable, of, switchMap, tap } from "rxjs";
import { inject, Injectable } from "@angular/core";
import { ScheduleCategoryMockRepository } from "./schedule-category-mock.service";
import { event, EventObs } from "../../../../common/directives/base-form-component.directive";
import moment from "moment";
import { RecurrenceWeekday } from "../../models/recurrence.model";
import { RecurrenceMockService } from "./recurrence-mock.service";
import { PayableMockRepository } from "../../../financial/services/mock/payable-mock.service";
import { ReceivableMockRepository } from "../../../financial/services/mock/receivable-mock.service";

@Injectable({ providedIn: "root" })
export class ScheduleMockState extends PllRecordState<Schedule> {};

@Injectable({ providedIn: "root" })
export class ScheduleMockRepository extends PllRecordRepository<Schedule> {
  override state = inject(ScheduleMockState);
};

export class ScheduleMockService extends PllMockRestService<Schedule> implements ScheduleService {
  override repository = inject(ScheduleMockRepository);
  
  scheduleCategoryMockRepository = inject(ScheduleCategoryMockRepository);
  recurrenceMockService = inject(RecurrenceMockService);

  payableMockRepository = inject(PayableMockRepository);
  receivableMockRepository = inject(ReceivableMockRepository);
  
  override $evInitPost: EventObs<Schedule> = event(
    switchMap(schedule => this.recurrenceMockService.post({
      id: null,
      scheduleId: schedule.id,
      financialRecurrenceId: null,
      endType: "NEVER",
      frequency: schedule.frequency === "NO_REPETITION" || schedule.frequency === "CUSTOM"? "WEEKLY" : schedule.frequency, 
      byWeekday: schedule.frequency === "WEEKLY" || schedule.frequency === "NO_REPETITION" || schedule.frequency === "CUSTOM"? [moment(schedule.startsAt).format("dd").toUpperCase() as RecurrenceWeekday] : [],
      interval: 1,
      count: 0,
      createdAt: new Date(),
      startsAt: schedule.startsAt,
      endsAt: schedule.startsAt,
      exceptions: [],
      active: schedule.frequency !== "NO_REPETITION",
    }).pipe(map(recurrence =>({ ...schedule, recurrenceId: recurrence.id })))),
  );

  override $evNextPut: EventObs<Schedule> = event(
    switchMap(schedule => this.recurrenceMockService.get(schedule.recurrenceId).pipe(
      switchMap(recurrence => schedule.frequency === "CUSTOM"? of(schedule) : this.recurrenceMockService.put({ 
        ...recurrence,
        endType: "NEVER",
        frequency: schedule.frequency === "NO_REPETITION"? "DAILY" : schedule.frequency, 
        byWeekday: schedule.frequency === "WEEKLY" || schedule.frequency === "NO_REPETITION"? [moment(schedule.startsAt).format("dd").toUpperCase() as RecurrenceWeekday] : [],
        interval: 1,
        count: 0,
        createdAt: new Date(),
        startsAt: schedule.startsAt,
        endsAt: schedule.startsAt,
        exceptions: [],
        active: schedule.frequency !== "NO_REPETITION",
      })),
    )),
  );

  getAllByFilter(params: GetAllScheduleByFilterParams): Observable<PllPaginatedResponse<GetAllScheduleByFilterResponse>> {
    return this.repository.$find({
      startsAt: { $lte: params.endsAt },
      endsAt: { $gte: params.startsAt },
      ...(!params?.categoryIds || !params.categoryIds.length? {} : { categoryId: { $in: params?.categoryIds }}),
    }).pipe(
      delay(this.delay()),
      map(response => ({ ...response, data: this.merge<Schedule, GetAllScheduleByFilterResponse>(response.data, record => ({
        category: this.scheduleCategoryMockRepository.state.get(record.categoryId)?.name || "",
        color: this.scheduleCategoryMockRepository.state.get(record.categoryId)?.color || "VIOLET",
        type: "SCHEDULE",
      }))})),
      map(response => ({ ...response, data: [ ...response.data, ...this.payableMockRepository.find({
        dueAt: { $gte: params.startsAt, $lte: params.endsAt },
        paidAt: { $eq: null }, 
        cancelledAt: { $eq: null },
      }).data.map(payable => {
        const category = this.scheduleCategoryMockRepository.state.data().find(category => category.type === "PAYABLE");
        const record: GetAllScheduleByFilterResponse = {
          id: payable.id,
          scheduleId: null,
          recurrenceId: null,
          categoryId: category?.id || null,
          category: category?.name || "",
          color: category?.color || "ROSE",
          type: "PAYABLE",
          title: payable.name,
          frequency: "DAILY",
          createdAt: payable.createdAt,
          startsAt: payable.dueAt,
          endsAt: payable.dueAt,
          startsAtTime: null,
          endsAtTime: null,
        };
        return record;
      })]})),
       map(response => ({ ...response, data: [ ...response.data, ...this.receivableMockRepository.find({
        dueAt: { $gte: params.startsAt, $lte: params.endsAt },
        paidAt: { $eq: null }, 
        cancelledAt: { $eq: null },
       }).data.map(receivable => {
        const category = this.scheduleCategoryMockRepository.state.data().find(category => category.type === "RECEIVABLE");
        const record: GetAllScheduleByFilterResponse = {
          id: receivable.id,
          scheduleId: null,
          recurrenceId: null,
          categoryId: category?.id || null,
          category: category?.name || "",
          color: category?.color || "EMERALD",
          type: "PAYABLE",
          title: receivable.name,
          frequency: "DAILY",
          createdAt: receivable.createdAt,
          startsAt: receivable.dueAt,
          endsAt: receivable.dueAt,
          startsAtTime: null,
          endsAtTime: null,
        };
        return record;
      })]})),
    );
  };
};