import { PllID } from "../../../core/lib/pollaris";

export class Schedule {
  id: PllID;
  scheduleId: PllID;
  recurrenceId: PllID;
  categoryId: PllID;
  title: string;
  createdAt: Date;
  startsAt: Date;
  endsAt: Date;
  startsAtTime: string;
  endsAtTime: string;

  constructor(props: Partial<Schedule>) {
    Object.assign(this, props);
  };
};