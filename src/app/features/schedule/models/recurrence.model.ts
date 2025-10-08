import { PllID } from "@pollaris";

export type RecurrenceFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
export type RecurrenceWeekday = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";
export type RecurrenceType = "PAYABLE" | "RECEIVABLE" | "SCHEDULE" | "INBOX" | "GOAL";

export class Recurrence {
  id: PllID;
  frequency: RecurrenceFrequency;
  byWeekday: RecurrenceWeekday[];
  interval: number;
  count: number;
  createdAt: Date;
  startsAt: Date;
  endsAt: Date;
  exceptions: Date[];
  type: RecurrenceType;
  active: boolean;

  constructor(props: Partial<Recurrence>) {
    Object.assign(this, props);
  };
};