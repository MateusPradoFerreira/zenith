
import { Colors } from "../../../common/types/colors.type";
import { PllID } from "../../../core/lib/pollaris";

export class ScheduleCategory {
  id: PllID;
  name: string;
  active: boolean;
  color: Colors;

  constructor(props: Partial<ScheduleCategory>) {
    Object.assign(this, props);
  };
};