import { fakerJs } from "../../../core/config/faker.config";
import { ID } from "../../../core/types/form-schema.type";
import { v4 as uuid } from 'uuid';
import { InitialPlanOfAccountMockRegistries } from "../services/mock/plan-of-account-mock.service";
import { InitialCenterOfCostMockRegistries } from "../services/mock/center-of-cost-mock.service";

export type ReceivableStatus = "PENDING" | "PAID" | "OVERDUE";

export class Receivable {
  id: ID;
  centerOfCostId: ID;
  planOfAccountId: ID;
  secrecyId: ID;
  docNumber: string;
  name: string;
  value: number;
  dueAt: Date;
  paidAt: Date;
  createdAt: Date;
  status: ReceivableStatus;
  description: string;

  constructor(props: Partial<Receivable>) {
    Object.assign(this, props);
    this.id = props.id || uuid();
  };

  static create(props?: Partial<Receivable>): Receivable {
    const status = props?.status || fakerJs.helpers.arrayElement(["PENDING", "PAID", "OVERDUE"]);
    const dueAt = props?.dueAt || status === "OVERDUE"? fakerJs.date.past() : fakerJs.date.future();
    return new Receivable({
      centerOfCostId: fakerJs.helpers.arrayElement(InitialCenterOfCostMockRegistries.filter(reg => reg.active)).id,
      planOfAccountId: fakerJs.helpers.arrayElement(InitialPlanOfAccountMockRegistries.filter(reg => reg.active)).id,
      secrecyId: fakerJs.helpers.arrayElement(InitialCenterOfCostMockRegistries.filter(reg => reg.active)).id,
      docNumber: String(fakerJs.number.int({ min: 20, max: 2000 })).padStart(10, "0"),
      name: fakerJs.finance.accountName(),
      value: fakerJs.helpers.arrayElement([fakerJs.number.float({ min: 20, max: 2000, fractionDigits: 2 }), fakerJs.number.int({ min: 20, max: 2000 })]),
      dueAt,
      paidAt: status === "PAID"? fakerJs.date.past() : null,
      createdAt: fakerJs.date.past({ refDate: dueAt }),
      status,
      description: fakerJs.finance.transactionDescription(),
      ...props,
    });
  };

};