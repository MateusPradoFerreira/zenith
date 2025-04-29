import { fakerJs } from "../../../core/config/faker.config";
import { v4 as uuid } from 'uuid';

export class Payable {
  id: string;
  name: string;
  value: number;

  constructor(props: Partial<Payable>) {
    Object.assign(this, props);
    this.id = props.id || uuid();
  };

  static createRegistry(props?: Partial<Payable>): Payable {
    return new Payable({
      name: fakerJs.finance.accountName(),
      value: fakerJs.number.float({ min: 20, max: 2000, fractionDigits: 2 }),
      ...props,
    });
  };
};

export class GetAllPayableResponse {
  id: string;
  name: string;
  method: string;
  status: string;
  amount: number;

  constructor(props: Partial<GetAllPayableResponse>) {
    Object.assign(this, props);
    this.id = props.id || uuid();
  };

  static createRegistry(props?: Partial<GetAllPayableResponse>): GetAllPayableResponse {
    return new GetAllPayableResponse({
      name: fakerJs.finance.accountName(),
      amount: fakerJs.number.float({ min: 20, max: 2000, fractionDigits: 2 }),
      method: fakerJs.finance.transactionType(),
      status: "Pending",
      ...props,
    });
  };
};