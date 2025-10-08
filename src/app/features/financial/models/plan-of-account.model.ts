import { PllID } from "@pollaris";

export class PlanOfAccount {
  id: PllID;
  name: string;
  active: boolean;

  constructor(props: Partial<PlanOfAccount>) {
    Object.assign(this, props);
  };
};