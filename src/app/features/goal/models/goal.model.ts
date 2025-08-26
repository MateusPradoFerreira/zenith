import { PllID } from "../../../core/lib/pollaris";

export type GoalColor = "SLATE" | "ZINC" | "STONE" | "RED" | "ORANGE" | "AMBER" | "YELLOW" | "LIME" | "GREEN" | "EMERALD" | "TEAL" | "CYAN" | "SKY" | "BLUE" | "INDIGO" | "VIOLET" | "PURPLE" | "FUCHSIA" | "PINK" | "ROSE";

export class Goal {
  id: PllID;
  scheduleId: PllID;
  name: string;
  description: string;
  color: GoalColor;
  duration: number;

  constructor(props: Partial<Goal>) {
    Object.assign(this, props);
  };
};