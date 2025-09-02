
import { PllID } from "../../../core/lib/pollaris";

export type RecurrenceFrequency = "NO_REPETITION" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
export type RecurrenceWeekday = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";
export type RecurrenceType = "PAYABLE" | "RECEIVABLE" | "SCHEDULE" | "INBOX" | "GOAL";

export class Recurrence {
  id: PllID;
  frequency: RecurrenceFrequency;
  byWeekday: RecurrenceWeekday[];
  byMonthDay: number[];
  byMonth: number[];
  interval: number;
  count: number;
  createdAt: Date;
  startsAt: Date;
  endsAt: Date;
  exceptions: Date[];
  type: RecurrenceType;

  constructor(props: Partial<Recurrence>) {
    Object.assign(this, props);
  };
};