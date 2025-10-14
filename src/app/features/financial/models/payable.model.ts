import { PllID } from "@pollaris";

export type PayableStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";

export class Payable {
  id: PllID;
  financialRecurrenceId: PllID;
  centerOfCostId: PllID;
  planOfAccountId: PllID;
  secrecyId: PllID;
  bankAccountId: PllID;
  sequence: number;
  docNumber: string;
  name: string;
  value: number;
  dueAt: Date;
  paidAt: Date;
  createdAt: Date;
  cancelledAt: Date;
  status: PayableStatus;
  description: string;
  active: boolean;

  constructor(props: Partial<Payable>) {
    Object.assign(this, props);
  };
};