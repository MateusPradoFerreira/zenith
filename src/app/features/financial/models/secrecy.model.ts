import { PllID } from "@pollaris";

export class Secrecy {
  id: PllID;
  name: string;
  active: boolean;

  constructor(props: Partial<Secrecy>) {
    Object.assign(this, props);
  };
};