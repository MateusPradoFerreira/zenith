import { PllMockedRestService } from "@pollaris";
import { Schedule, ScheduleWeekday } from "../models/schedule.model";
import { GetAllScheduleByFilterParams, ScheduleService } from "./schedule.service";
import { delay, Observable, of } from "rxjs";
import { fakerJs } from "../../../core/config/faker.config";
import moment from "moment";
import { v4 as uuid } from 'uuid';
import { Injectable } from "@angular/core";
import { INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA } from "./schedule-category-mock.service";
import { RRule, Options, RRuleSet, Weekday } from 'rrule';

export function createMokedSchedule(data: Partial<Schedule>): Schedule {
  const frequency = fakerJs.helpers.arrayElement(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]);
  const startsAt = fakerJs.date.past();
  const endsAt = fakerJs.date.future({ refDate: startsAt });
  const interval = fakerJs.number.int({ min: 1, max: 5 });
  const count = fakerJs.datatype.boolean() ? fakerJs.number.int({ min: 2, max: 10 }) : null;
  const weekdays = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"] as const;

  return new Schedule({
    title: "New Schedule",
    categoryId: fakerJs.helpers.arrayElement(INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA.filter(category => category.type === "SCHEDULE")).id,
    frequency,
    interval,
    count,
    endsAt,
    byWeekday: frequency === "WEEKLY" ? fakerJs.helpers.arrayElements(weekdays, fakerJs.number.int({ min: 1, max: 3 })) : null,
    byMonthDay: frequency === "MONTHLY" ? fakerJs.helpers.arrayElements([...Array(28).keys()].map(i => i + 1), 2) : null,
    byMonth: frequency === "YEARLY" ? fakerJs.helpers.arrayElements([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 2) : null,
    startsAt,
    exceptions: fakerJs.helpers.maybe(() => [fakerJs.date.between({ from: startsAt, to: endsAt })], { probability: 0.5 }),
    ...data,
    id: data.id || uuid(),
  });
};

@Injectable({ providedIn: "root" })
export class ScheduleMockedService extends PllMockedRestService<Schedule> implements ScheduleService {

  constructor() {
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
    const allOccurrences = this._generateSchedulesFromOccurrences(records);
    return allOccurrences.filter(schedule =>
      moment(schedule.startsAt).isBetween(
        moment(params.startsAt).startOf('day'),
        moment(params.endsAt).endOf('day'),
        undefined,
        '[]'
      ),
    );
  };

  private _buildRRuleOptions(record: Schedule): Partial<Options> | null {
    const frequencyMap = {
      DAILY: RRule.DAILY,
      WEEKLY: RRule.WEEKLY,
      MONTHLY: RRule.MONTHLY,
      YEARLY: RRule.YEARLY,
    };

    const weekdayMap: Record<ScheduleWeekday, Weekday> = {
      MO: RRule.MO,
      TU: RRule.TU,
      WE: RRule.WE,
      TH: RRule.TH,
      FR: RRule.FR,
      SA: RRule.SA,
      SU: RRule.SU,
    };

    if (record.frequency === "NO_REPETITION") return null;
    const freq = frequencyMap[record.frequency];
    if (!freq) return null;

    return {
      freq,
      dtstart: new Date(record.startsAt),
      until: record.endsAt ? new Date(record.endsAt) : undefined,
      interval: record.interval || 1,
      count: record.count || undefined,
      byweekday: record.byWeekday?.map(day => weekdayMap[day]),
      bymonthday: record.byMonthDay,
      bymonth: record.byMonth,
    };
  };

  private _generateSchedulesFromOccurrences(records: Schedule[]): Schedule[] {
    const generated: Schedule[] = [];

    for (const record of records) {
      const options = this._buildRRuleOptions(record);
      const ruleSet = new RRuleSet();

      if (options) {
        ruleSet.rrule(new RRule(options));
      } else {
        // NO_REPETITION: retorna o próprio Schedule
        generated.push(record);
        continue;
      };

      record.exceptions?.forEach(date => {
        ruleSet.exdate(new Date(date));
      });

      const rangeStart = moment(record.startsAt).startOf('day').toDate();
      const rangeEnd = moment().add(1, 'year').endOf('day').toDate();

      const occurrences = ruleSet.between(rangeStart, rangeEnd, true);

      occurrences.forEach(occurrence => {
        const startsAt = new Date(occurrence);
        const endsAt = moment(startsAt)
          .set({
            hour: +record.endsAtTime?.split(':')[0],
            minute: +record.endsAtTime?.split(':')[1],
            second: 0,
          })
          .toDate();

        generated.push(new Schedule({
          ...record,
          startsAt,
          endsAt,
        }));
      });
    };

    return generated;
  };
};