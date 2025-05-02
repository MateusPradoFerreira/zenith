import { Injectable } from "@angular/core";
import { BaseMockService } from "../../../../core/base/base-mock-service";
import { PlanOfAccount } from "../../models/plan-of-account.model";
import { GetAllPlanOfAccountByFilterParams, PlanOfAccountService } from "../plan-of-account.service";
import { delay, Observable, of } from "rxjs";
import { fakerJs } from "../../../../core/config/faker.config";

export const InitialPlanOfAccountMockRegistries: PlanOfAccount[] = [
  PlanOfAccount.create({ name: "Geral", default: true }),
  PlanOfAccount.create({ name: "Despesas Antecipadas" }),
  PlanOfAccount.create({ name: "Estoques" }),
  PlanOfAccount.create({ name: "Intangível", active: false }),
  PlanOfAccount.create({ name: "Imobilizado", active: false }),
  PlanOfAccount.create({ name: "Investimentos" }),
];

@Injectable()
export class PlanOfAccountMockService extends BaseMockService<PlanOfAccount> implements PlanOfAccountService {
  constructor() { super({ initialData: InitialPlanOfAccountMockRegistries }) };

  override create(props: Partial<PlanOfAccount>): PlanOfAccount {
    return PlanOfAccount.create(props);
  };

  getAllByFilter({ status }: GetAllPlanOfAccountByFilterParams): Observable<PlanOfAccount[]> {
    const filteredData = this.filterByStatus(this.registries, status);
    return of(filteredData).pipe(delay(fakerJs.number.int({ min: 50, max: 300 }))) as Observable<PlanOfAccount[]>;
  };
};