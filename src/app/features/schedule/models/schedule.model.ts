import { PllID } from "@pollaris";

export type ScheduleFrequency = "NO_REPETITION" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | "CUSTOM";
export type ScheduleStatus = "TO_MAKE" | "IN_PROGRESS" | "CANCELLED" | "FINISHED";

export class Schedule {
  id: PllID;
  scheduleId: PllID;
  recurrenceId: PllID;
  categoryId: PllID;
  title: string;
  status: ScheduleStatus;
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