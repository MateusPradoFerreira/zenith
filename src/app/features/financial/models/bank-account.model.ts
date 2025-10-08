import { PllID } from "@pollaris";

export class BankAccount {
  id: PllID;
  name: string;
  active: boolean;

  constructor(props: Partial<BankAccount>) {
    Object.assign(this, props);
  };
};