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
  
  override $evInitPost: EventObs<Schedule> = event(
    switchMap(schedule => this.recurrenceMockService.post({
      id: null,
      endType: "NEVER",
      frequency: schedule.frequency === "NO_REPETITION" || schedule.frequency === "CUSTOM"? "WEEKLY" : schedule.frequency, 
      byWeekday: schedule.frequency === "WEEKLY" || schedule.frequency === "NO_REPETITION" || schedule.frequency === "CUSTOM"? [moment(schedule.startsAt).format("dd").toUpperCase() as RecurrenceWeekday] : [],
      interval: 1,
      count: 0,
      createdAt: new Date(),
      startsAt: schedule.startsAt,
      endsAt: schedule.startsAt,
      exceptions: [],
      type: "SCHEDULE",
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
        type: "SCHEDULE",
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
    );
  };
};