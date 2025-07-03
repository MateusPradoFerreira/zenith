import { PllMockedRestService } from "@pollaris";
import { Schedule } from "../models/schedule.model";
import { GetAllScheduleByFilterParams, ScheduleService } from "./schedule.service";
import { delay, Observable, of } from "rxjs";
import { fakerJs } from "../../../core/config/faker.config";
import moment from "moment";
import { v4 as uuid } from 'uuid';
import { Injectable } from "@angular/core";

export function createMokedSchedule(data: Partial<Schedule>): Schedule {
  const frequency = fakerJs.helpers.arrayElement(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]);
  const startsAt = fakerJs.date.past();
  const endsAt = fakerJs.date.future({ refDate: startsAt });
  const interval = fakerJs.number.int({ min: 1, max: 5 });
  const count = fakerJs.datatype.boolean()? fakerJs.number.int({ min: 2, max: 10 }) : null;
  const weekdays = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"] as const;

  return new Schedule({
    title: "New Schedule",
    frequency,
    interval,
    count,
    endsAt,
    byWeekday: frequency === "WEEKLY" ? fakerJs.helpers.arrayElements(weekdays, fakerJs.number.int({ min: 1, max: 3 })): null,
    byMonthDay: frequency === "MONTHLY" ? fakerJs.helpers.arrayElements([...Array(28).keys()].map(i => i + 1), 2): null,
    byMonth: frequency === "YEARLY" ? fakerJs.helpers.arrayElements([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 2): null,
    startsAt,
    exceptions: fakerJs.helpers.maybe(() => [fakerJs.date.between({ from: startsAt, to: endsAt })], { probability: 0.5 }),
    ...data,
    id: data.id || uuid(),
  });
};

@Injectable({ providedIn: "root" })
export class ScheduleMockedService extends PllMockedRestService<Schedule> implements ScheduleService {

  constructor () {
    super([
      createMokedSchedule({ title: "Bha 1" }),
      createMokedSchedule({ title: "Bha 2" }),
    ]);
  };

  override createRecord = (data: Partial<Schedule>) => createMokedSchedule(data);

  getAllByFilter(params: GetAllScheduleByFilterParams): Observable<Schedule[]> {
    return of(this._filtering(this.records(), params)).pipe(delay(fakerJs.helpers.rangeToNumber({ min: 100, max: 500 })));
  };

  private _filtering(records: Schedule[], params: GetAllScheduleByFilterParams): Schedule[] {
    return records.filter(record => moment(record.createdAt).isBetween(params.startsAt, params.endsAt));
  };
};