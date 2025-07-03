import { PllID } from "../../../core/lib/pollaris";

export class Secrecy {
  id: PllID;
  name: string;
  active: boolean;

  constructor(props: Partial<Secrecy>) {
    Object.assign(this, props);
  };
};