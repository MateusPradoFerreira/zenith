import { PllID } from "../../../core/lib/pollaris";
import { GoalColor } from "./goal.model";

export class GoalTask {
  id: PllID;
  goalId: PllID;
  name: string;
  description: string;
  color: GoalColor;
  duration: number;

  constructor(props: Partial<GoalTask>) {
    Object.assign(this, props);
  };
};