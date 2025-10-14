import { PllID } from "@pollaris";

export type FinancialRecurrenceType = "PAYABLE" | "RECEIVABLE";

export class FinancialRecurrence {
  id: PllID;
  recurrenceId: PllID;
  name: string;
  value: number;
  type: FinancialRecurrenceType;
  description: string;
  active: boolean;
  date: Date;
  createdAt: Date;

  constructor(props: Partial<FinancialRecurrence>) {
    Object.assign(this, props);
  };
};