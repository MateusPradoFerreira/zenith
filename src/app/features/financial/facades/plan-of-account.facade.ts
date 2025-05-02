import { inject, Injectable } from "@angular/core";
import { PlanOfAccount } from "../models/plan-of-account.model";
import { GetAllPlanOfAccountByFilterParams, PlanOfAccountService } from "../services/plan-of-account.service";
import { BaseFacade, BaseFacadeList } from "../../../core/base/base-facade";
import { FormSchemaConfig } from "../../../core/types/form-schema.type";
import { Validators } from "@angular/forms";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class PlanOfAccountFacade extends BaseFacade<PlanOfAccount> implements BaseFacadeList<PlanOfAccount, GetAllPlanOfAccountByFilterParams> {
  override service: PlanOfAccountService = inject(PlanOfAccountService);
  
  override formSchema: FormSchemaConfig<PlanOfAccount, PlanOfAccount> = {
    id: { defaultValue: null },
    name: { defaultValue: null, validators: [Validators.required] },
    active: { defaultValue: true },
    default: { defaultValue: false },
  };

  getByAllFilters(params: GetAllPlanOfAccountByFilterParams): Observable<PlanOfAccount[]> {
    return this.service.getAllByFilter(params);
  };
};