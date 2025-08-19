import { PllMockedRestService, PllPaginatedResponse } from "@pollaris";
import { BankAccount } from "../models/bank-account.model";
import { GetAllBankAccountByFilterParams, GetAllBankAccountByFilterResponse, BankAccountService } from "./bank-account.service";
import { delay, map, Observable, of } from "rxjs";
import { fakerJs } from "../../../core/config/faker.config";
import { v4 as uuid } from 'uuid';

export function createMokedBankAccount(data: Partial<BankAccount>): BankAccount {
  return new BankAccount({
    active: true,
    ...data,
    id: data.id || uuid(),
  });
};

export const INITIAL_BANK_ACCOUNT_MOCKED_DATA: BankAccount[] = [
  createMokedBankAccount({ name: "Sicoob" }),
  createMokedBankAccount({ name: "Banco do Brasil" }),
];

export class BankAccountMockedService extends PllMockedRestService<BankAccount> implements BankAccountService {

  constructor () {
    super(INITIAL_BANK_ACCOUNT_MOCKED_DATA);
  };

  override createRecord = (data: Partial<BankAccount>) => createMokedBankAccount(data);

  getAllByFilter(params: GetAllBankAccountByFilterParams): Observable<PllPaginatedResponse<GetAllBankAccountByFilterResponse>> {
    return of(this._filtering(this.records(), params)).pipe(delay(fakerJs.helpers.rangeToNumber({ min: 100, max: 500 }))).pipe(map(response => ({
      data: response,
      pagination: {
        page: 1,
      },
    })));
  };

  private _filtering(records: BankAccount[], params: GetAllBankAccountByFilterParams): BankAccount[] {
    return records.filter(record => !params.status || params.status === "ALL"? true : params.status === "ACTIVE"? record.active : !record.active);
  };
};