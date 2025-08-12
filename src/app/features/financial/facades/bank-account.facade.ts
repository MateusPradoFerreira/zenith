import { inject, Injectable, Type } from "@angular/core";
import { PllFacade } from "../../../core/lib/pollaris";
import { BankAccount } from "../models/bank-account.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "../../../core/lib/pollaris/forms/refiners";
import { GetAllBankAccountByFilterParams, BankAccountService } from "../services/bank-account.service";
import { BankAccountState } from "../states/bank-account.state";
import { BankAccountMapper } from "../mappers/bank-account.mapper";
import { DialogWidth } from "../../../common/facades/dialog.facade";
import { BankAccountFormComponent } from "../views/bank-account/bank-account-form/bank-account-form.component";

export type BankAccountUseQueryParams = GetAllBankAccountByFilterParams;

@Injectable({ providedIn: "root" })
export class BankAccountFacade extends PllFacade<BankAccount, BankAccount, BankAccount, BankAccountUseQueryParams, BankAccountFormComponent> {
  override state = inject(BankAccountState);
  override service = inject(BankAccountService);
  override mapper = inject(BankAccountMapper);
  override queryFn = (params: BankAccountUseQueryParams) => this.service.getAllByFilter(params);

  override header: string = "Conta Bancária";
  override component: Type<any> = BankAccountFormComponent;
  override dialogWidth: DialogWidth = "sm";
  override closeOnSave: boolean = true;

  override recordSchema: PllFormSchemaConfig<BankAccount> = {
    fields: {
      id: { value: null },
      name: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      active: { value: true },
    },
  };

  override filterSchema: PllFormSchemaConfig<BankAccountUseQueryParams> = {
    fields: {
      status: { value: "ACTIVE" },
    },
  };
};