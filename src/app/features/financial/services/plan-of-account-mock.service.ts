import { PllMockedRestService } from "@pollaris";
import { PlanOfAccount } from "../models/plan-of-account.model";
import { GetAllPlanOfAccountByFilterParams, GetAllPlanOfAccountByFilterResponse, PlanOfAccountService } from "./plan-of-account.service";
import { delay, Observable, of } from "rxjs";
import { fakerJs } from "../../../core/config/faker.config";
import { v4 as uuid } from 'uuid';

export function createMokedPlanOfAccount(data: Partial<PlanOfAccount>): PlanOfAccount {
  return new PlanOfAccount({
    active: true,
    ...data,
    id: data.id || uuid(),
  });
};

export const INITIAL_PLAN_OF_ACCOUNT_MOCKED_DATA: PlanOfAccount[] = [
  createMokedPlanOfAccount({ name: "Geral" }),
];

export class PlanOfAccountMockedService extends PllMockedRestService<PlanOfAccount> implements PlanOfAccountService {

  constructor () {
    super(INITIAL_PLAN_OF_ACCOUNT_MOCKED_DATA);
  };

  override createRecord = (data: Partial<PlanOfAccount>) => createMokedPlanOfAccount(data);

  getAllByFilter(params: GetAllPlanOfAccountByFilterParams): Observable<GetAllPlanOfAccountByFilterResponse[]> {
    return of(this._filtering(this.records(), params)).pipe(
      delay(fakerJs.helpers.rangeToNumber({ min: 100, max: 500 })),
    );
  };

  private _filtering(records: PlanOfAccount[], params: GetAllPlanOfAccountByFilterParams): PlanOfAccount[] {
    return records.filter(record => !params.status || params.status === "ALL"? true : params.status === "ACTIVE"? record.active : !record.active);
  };
};