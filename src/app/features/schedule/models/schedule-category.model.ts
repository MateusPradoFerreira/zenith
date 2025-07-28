
import { PllID } from "../../../core/lib/pollaris";

export type ScheduleCategoryType = "PAYABLE" | "RECEIVABLE" | "SCHEDULE" | "TASK";

export class ScheduleCategory {
  id: PllID;
  name: string;
  type: ScheduleCategoryType;
  active: boolean;
  color: string;

  constructor(props: Partial<ScheduleCategory>) {
    Object.assign(this, props);
  };
};