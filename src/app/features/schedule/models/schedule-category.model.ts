
import { Colors } from "../../../common/types/colors.type";
import { PllID } from "@pollaris";

export type ScheduleCategoryType = "SCHEDULE" | "PAYABLE" | "RECEIVABLE" | "GOAL";

export class ScheduleCategory {
  id: PllID;
  name: string;
  active: boolean;
  color: Colors;
  type: ScheduleCategoryType;

  constructor(props: Partial<ScheduleCategory>) {
    Object.assign(this, props);
  };
};