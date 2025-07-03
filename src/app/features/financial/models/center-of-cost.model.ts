import { PllID } from "../../../core/lib/pollaris";

export class CenterOfCost {
  id: PllID;
  name: string;
  active: boolean;

  constructor(props: Partial<CenterOfCost>) {
    Object.assign(this, props);
  };
};