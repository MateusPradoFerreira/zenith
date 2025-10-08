import { PllID } from "@pollaris";

export type ReceivableStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";

export class Receivable {
  id: PllID;
  recurrenceId: PllID;
  centerOfCostId: PllID;
  planOfAccountId: PllID;
  secrecyId: PllID;
  bankAccountId: PllID;
  docNumber: string;
  sequence: number;
  name: string;
  value: number;
  dueAt: Date;
  paidAt: Date;
  createdAt: Date;
  cancelledAt: Date;
  status: ReceivableStatus;
  description: string;
  active: boolean;

  constructor(props: Partial<Receivable>) {
    Object.assign(this, props);
  };
};