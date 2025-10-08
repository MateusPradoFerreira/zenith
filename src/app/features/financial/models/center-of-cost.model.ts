import { PllID } from "@pollaris";

export class CenterOfCost {
  id: PllID;
  name: string;
  active: boolean;

  constructor(props: Partial<CenterOfCost>) {
    Object.assign(this, props);
  };
};