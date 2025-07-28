
import { PllID } from "../../../core/lib/pollaris";

export type ScheduleFrequency = "NO_REPETITION" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
export type ScheduleWeekday = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";

export class Schedule {
  id: PllID;
  categoryId: PllID;
  title: string;
  frequency: ScheduleFrequency;
  byWeekday: ScheduleWeekday[];
  byMonthDay: number[];
  byMonth: number[];
  interval: number;
  count: number;
  createdAt: Date;
  startsAt: Date;
  endsAt: Date;
  startsAtTime: string;
  endsAtTime: string;
  exceptions: Date[];

  constructor(props: Partial<Schedule>) {
    Object.assign(this, props);
  };
};