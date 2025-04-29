import { fakerJs } from "../../../core/config/faker.config";
import { v4 as uuid } from 'uuid';

export type PayableStatus = "PENDING" | "PAID" | "OVERDUE";

export class Payable {
  id: string;
  categoryIds: string[];
  name: string;
  value: number;
  dueAt: Date;
  paidAt: Date;
  createdAt: Date;
  status: PayableStatus;
  description: string;

  constructor(props: Partial<Payable>) {
    Object.assign(this, props);
    this.id = props.id || uuid();
  };

  static createRegistry(props?: Partial<Payable>): Payable {
    return new Payable({
      categoryIds: [],
      name: fakerJs.finance.accountName(),
      value: fakerJs.number.float({ min: 20, max: 2000, fractionDigits: 2 }),
      dueAt: fakerJs.date.past(),
      paidAt: fakerJs.date.past(),
      createdAt: fakerJs.date.past(),
      status: fakerJs.helpers.arrayElement(["PENDING", "PAID", "OVERDUE"]),
      description: fakerJs.finance.transactionDescription(),
      ...props,
    });
  };

};