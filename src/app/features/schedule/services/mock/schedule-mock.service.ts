import { PllMockRestService, PllPaginatedResponse, PllRecordRepository, PllRecordState } from "@pollaris";
import { Schedule } from "../../models/schedule.model";
import { GetAllScheduleByFilterParams, GetAllScheduleByFilterResponse, ScheduleService } from "../schedule.service";
import { delay, map, Observable } from "rxjs";
import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ScheduleMockState extends PllRecordState<Schedule> {};

@Injectable({ providedIn: "root" })
export class ScheduleMockRepository extends PllRecordRepository<Schedule> {
  override state = inject(ScheduleMockState);
};

export class ScheduleMockService extends PllMockRestService<Schedule> implements ScheduleService {
  override repository = inject(ScheduleMockRepository);

  /* override evPost: EventObs<Schedule> = event(
    switchMap(schedule => this.recurrenceMockService.post({
      id: null, 
      frequency: schedule.frequency === "NO_REPETITION" || schedule.frequency === "CUSTOM" ? "DAILY" : schedule.frequency, 
      byWeekday: schedule.frequency === "WEEKLY"? [moment(schedule.startsAt).format("dd").toUpperCase() as RecurrenceWeekday] : [],
      byMonthDay: schedule.frequency === "MONTHLY"? [schedule.startsAt.getDate()] : [],
      byMonth: schedule.frequency === "YEARLY"? [schedule.startsAt.getMonth() + 1] : [],
      interval: 1,
      count: 0,
      createdAt: new Date(),
      startsAt: schedule.startsAt,
      endsAt: schedule.endsAt,
      exceptions: [],
      type: "SCHEDULE",
      active: schedule.frequency !== "NO_REPETITION",
    }).pipe(
      switchMap(recurrence => this.put({ ...schedule, recurrenceId: recurrence.id })),
    )),
  ); */

  getAllByFilter(params: GetAllScheduleByFilterParams): Observable<PllPaginatedResponse<GetAllScheduleByFilterResponse>> {
    return this.repository.find({
      startsAt: { $lte: params.endsAt },
      endsAt: { $gte: params.startsAt },
      ...(!params?.categoryIds || !params.categoryIds.length? {} : { categoryId: { $in: params?.categoryIds }}),
    }).pipe(
      delay(this.delay()),
      map(response => ({ ...response, data: this.mergeData<Schedule, GetAllScheduleByFilterResponse>(response.data, () => ({
        category: "",
        color: "VIOLET",
        type: "SCHEDULE",
      }))})),
    );
  };
};