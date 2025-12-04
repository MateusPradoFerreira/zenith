import { inject, Injectable, Type } from "@angular/core";
import { PllFacade, PllQueryFacade } from "@pollaris";
import { BankAccount } from "../models/bank-account.model";
import { PllFormSchemaConfig } from "@pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "@pollaris/forms/refiners";
import { BankAccountViewParams, BankAccountService } from "../services/bank-account.service";
import { BankAccountState } from "../states/bank-account.state";
import { BankAccountFormComponent } from "../views/bank-account/bank-account-form/bank-account-form.component";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";

export type BankAccountUseQueryParams = BankAccountViewParams;
export type BankAccountUseQueryResponse = BankAccount;

@Injectable({ providedIn: "root" })
export class BankAccountFacade extends PllFacade<BankAccount, BankAccountFormComponent> {
  override state = inject(BankAccountState);
  override service = inject(BankAccountService);

  override header: string = "Conta Bancária";
  override component: Type<any> = BankAccountFormComponent;
  override dialogSize: DialogContentVariants["size"] = "md";
  override dialogAlign: DialogContentVariants["align"] = "center";
  override closeOnSave: boolean = true;

  override recordSchema: PllFormSchemaConfig<BankAccount> = {
    fields: {
      id: { value: null },
      name: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      active: { value: true },
    },
  };
};

@Injectable({ providedIn: "root" })
export class BankAccountQueryFacade extends PllQueryFacade<BankAccountUseQueryResponse, BankAccountUseQueryParams> {
  override service = inject(BankAccountService);
  override queryFn = (params: BankAccountUseQueryParams) => this.service.getAllByFilter(params);

  override filterSchema: PllFormSchemaConfig<BankAccountUseQueryParams> = {
    fields: {
      status: { value: "ACTIVE" },
    },
  };
};