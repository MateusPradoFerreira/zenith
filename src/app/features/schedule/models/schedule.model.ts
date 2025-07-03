
import { PllID } from "../../../core/lib/pollaris";

export type ScheduleFrequence = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
export type ScheduleWeekday = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";

export class Schedule {
  id: PllID;
  title: string;
  frequency: ScheduleFrequence;
  byWeekday: ScheduleWeekday[];
  byMonthDay: number[];
  byMonth: number[];
  interval: number;
  count: number;
  createdAt: Date;
  startsAt: Date;
  endsAt: Date;
  exceptions: Date[];

  constructor(props: Partial<Schedule>) {
    Object.assign(this, props);
  };
};