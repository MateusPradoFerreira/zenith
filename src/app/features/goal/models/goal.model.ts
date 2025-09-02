import { Colors } from "../../../common/types/colors.type";
import { PllID } from "../../../core/lib/pollaris";

export class Goal {
  id: PllID;
  scheduleId: PllID;
  name: string;
  description: string;
  color: Colors;
  duration: number;

  constructor(props: Partial<Goal>) {
    Object.assign(this, props);
  };
};