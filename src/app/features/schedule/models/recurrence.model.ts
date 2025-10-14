import { PllID } from "@pollaris";

export type RecurrenceFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
export type RecurrenceWeekday = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";
export type RecurrenceEndType = "DATE" | "COUNT" | "NEVER";

export class Recurrence {
  id: PllID;
  scheduleId: PllID;
  financialRecurrenceId: PllID;
  endType: RecurrenceEndType;
  frequency: RecurrenceFrequency;
  byWeekday: RecurrenceWeekday[];
  interval: number;
  count: number;
  createdAt: Date;
  startsAt: Date;
  endsAt: Date;
  exceptions: Date[];
  active: boolean;

  constructor(props: Partial<Recurrence>) {
    Object.assign(this, props);
  };
};