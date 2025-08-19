import { PllID } from "../../../core/lib/pollaris";

export type CashFlowType = "PAYABLE" | "RECEIVABLE" | "MARK";

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