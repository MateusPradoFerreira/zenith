import { PllID } from "@pollaris";

export type ScheduleFrequency = "NO_REPETITION" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | "CUSTOM";

export class Schedule {
  id: PllID;
  scheduleId: PllID;
  recurrenceId: PllID;
  categoryId: PllID;
  title: string;
  frequency: ScheduleFrequency;
  createdAt: Date;
  startsAt: Date;
  endsAt: Date;
  startsAtTime: string;
  endsAtTime: string;
  description: string;

  constructor(props: Partial<Schedule>) {
    Object.assign(this, props);
  };
};