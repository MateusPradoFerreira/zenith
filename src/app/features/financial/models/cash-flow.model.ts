import { PllID } from "@pollaris";

export type CashFlowType = "PAYABLE" | "PAYABLE_MARK" | "RECEIVABLE" | "RECEIVABLE_MARK" | "MARK" | "BANK" | "PERCENT" | "PERIOD";

export class CashFlow {
  id: PllID;
  name: string;
  values: any[];
  children: CashFlow[];
  type: CashFlowType;

  constructor(props: Partial<CashFlow>) {
    Object.assign(this, props);
  };
};