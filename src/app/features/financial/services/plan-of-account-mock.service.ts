import { PllMockRestService, PllPaginatedResponse } from "@pollaris";
import { PlanOfAccount } from "../models/plan-of-account.model";
import { GetAllPlanOfAccountByFilterParams, GetAllPlanOfAccountByFilterResponse, PlanOfAccountService } from "./plan-of-account.service";
import { delay, map, Observable, of } from "rxjs";
import { fakerJs } from "../../../core/config/faker.config";
import { v4 as uuid } from 'uuid';
import { Util } from "../../../common/util/util";

export function createMockedPlanOfAccount(data: Partial<PlanOfAccount>): PlanOfAccount {
  return new PlanOfAccount({
    active: true,
    ...data,
    id: data.id || uuid(),
  });
};

export const INITIAL_PLAN_OF_ACCOUNT_MOCKED_DATA: PlanOfAccount[] = [
  createMockedPlanOfAccount({ name: "Geral" }),
  createMockedPlanOfAccount({ name: "Vendas" }),
  createMockedPlanOfAccount({ name: "Compras" }),
  createMockedPlanOfAccount({ name: "Serviços" }),
  createMockedPlanOfAccount({ name: "Financeiro" }),
];

export class PlanOfAccountMockService extends PllMockRestService<PlanOfAccount> implements PlanOfAccountService {

  constructor () {
    super(INITIAL_PLAN_OF_ACCOUNT_MOCKED_DATA);
  };

  override createRecord = (data: Partial<PlanOfAccount>) => createMockedPlanOfAccount(data);

  getAllByFilter(params: GetAllPlanOfAccountByFilterParams): Observable<PllPaginatedResponse<GetAllPlanOfAccountByFilterResponse>> {
    return of(this._filtering(this.records(), params)).pipe(
      delay(fakerJs.helpers.rangeToNumber({ min: 100, max: 500 })),
      map(response => Util.paginatedValueFrom(response)),
    );
  };

  private _filtering(records: PlanOfAccount[], params: GetAllPlanOfAccountByFilterParams): PlanOfAccount[] {
    return records.filter(record => !params.status || params.status === "ALL"? true : params.status === "ACTIVE"? record.active : !record.active);
  };
};