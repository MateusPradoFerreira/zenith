import { inject, Injectable, Type } from "@angular/core";
import { PllFacade } from "../../../core/lib/pollaris";
import { PlanOfAccount } from "../models/plan-of-account.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "../../../core/lib/pollaris/forms/refiners";
import { GetAllPlanOfAccountByFilterParams, PlanOfAccountService } from "../services/plan-of-account.service";
import { PlanOfAccountState } from "../states/plan-of-account.state";
import { PlanOfAccountMapper } from "../mappers/plan-of-account.mapper";
import { PlanOfAccountFormComponent } from "../views/plan-of-account/plan-of-account-form/plan-of-account-form.component";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";

export type PlanOfAccountUseQueryParams = GetAllPlanOfAccountByFilterParams;

@Injectable({ providedIn: "root" })
export class PlanOfAccountFacade extends PllFacade<PlanOfAccount, PlanOfAccount, PlanOfAccount, PlanOfAccountUseQueryParams, PlanOfAccountFormComponent> {
  override state = inject(PlanOfAccountState);
  override service = inject(PlanOfAccountService);
  override mapper = inject(PlanOfAccountMapper);
  override queryFn = (params: PlanOfAccountUseQueryParams) => this.service.getAllByFilter(params);

  override header: string = "Plano de Conta";
  override component: Type<any> = PlanOfAccountFormComponent;
  override dialogWidth: DialogContentVariants["width"] = "sm";
  override closeOnSave: boolean = true;

  override recordSchema: PllFormSchemaConfig<PlanOfAccount> = {
    fields: {
      id: { value: null },
      name: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      active: { value: true },
    },
  };

  override filterSchema: PllFormSchemaConfig<PlanOfAccountUseQueryParams> = {
    fields: {
      status: { value: "ACTIVE" },
    },
  };
};