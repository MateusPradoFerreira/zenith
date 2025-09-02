import { PllID } from "../../../core/lib/pollaris";

export class GoalItem {
  id: PllID;
  goalId: PllID;
  description: string;
  startsAt: Date;
  startsAtTime: string;
  duration: number;

  constructor(props: Partial<GoalItem>) {
    Object.assign(this, props);
  };
};