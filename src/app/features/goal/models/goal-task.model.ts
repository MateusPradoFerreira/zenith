import { Colors } from "../../../common/types/colors.type";
import { PllID } from "../../../core/lib/pollaris";

export class GoalTask {
  id: PllID;
  goalId: PllID;
  name: string;
  description: string;
  color: Colors;
  duration: number;

  constructor(props: Partial<GoalTask>) {
    Object.assign(this, props);
  };
};