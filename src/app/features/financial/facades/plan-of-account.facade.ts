import { inject, Injectable, Type } from "@angular/core";
import { PllFacade, PllQueryFacade } from "@pollaris";
import { PlanOfAccount } from "../models/plan-of-account.model";
import { PllFormSchemaConfig } from "@pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "@pollaris/forms/refiners";
import { PlanOfAccountViewParams, PlanOfAccountService } from "../services/plan-of-account.service";
import { PlanOfAccountState } from "../states/plan-of-account.state";
import { PlanOfAccountFormComponent } from "../views/plan-of-account/plan-of-account-form/plan-of-account-form.component";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";

export type PlanOfAccountUQP = PlanOfAccountViewParams;
export type PlanOfAccountUQR = PlanOfAccount;

@Injectable({ providedIn: "root" })
export class PlanOfAccountFacade extends PllFacade<PlanOfAccount, PlanOfAccountFormComponent> {
  override state = inject(PlanOfAccountState);
  override service = inject(PlanOfAccountService);

  override header: string = "Plano de Conta";
  override component: Type<any> = PlanOfAccountFormComponent;
  override dialogSize: DialogContentVariants["size"] = "md";
  override dialogAlign: DialogContentVariants["align"] = "center";
  override closeOnSave: boolean = true;

  override recordSchema: PllFormSchemaConfig<PlanOfAccount> = {
    fields: {
      id: { value: null },
      name: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      active: { value: true },
    },
  };
};

@Injectable({ providedIn: "root" })
export class PlanOfAccountQueryFacade extends PllQueryFacade<PlanOfAccountUQR, PlanOfAccountUQP> {
  override service = inject(PlanOfAccountService);
  override queryFn = (params: PlanOfAccountUQP) => this.service.getAllByFilter(params);

  override filterSchema: PllFormSchemaConfig<PlanOfAccountUQP> = {
    fields: {
      status: { value: "ACTIVE" },
    },
  };
};