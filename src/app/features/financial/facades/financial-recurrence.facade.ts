import { inject, Injectable, Type } from "@angular/core";
import { PllFacade, PllQueryFacade } from "@pollaris";
import { FinancialRecurrence } from "../models/financial-recurrence.model";
import { PllFormSchemaConfig } from "@pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "@pollaris/forms/refiners";
import { FinancialRecurrenceViewParams, FinancialRecurrenceService } from "../services/financial-recurrence.service";
import { FinancialRecurrenceState } from "../states/financial-recurrence.state";
import { FinancialRecurrenceFormComponent } from "../views/financial-recurrence/financial-recurrence-form/financial-recurrence-form.component";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";

export type FinancialRecurrenceUQP = FinancialRecurrenceViewParams;
export type FinancialRecurrenceUQR = FinancialRecurrence;

@Injectable({ providedIn: "root" })
export class FinancialRecurrenceFacade extends PllFacade<FinancialRecurrence, FinancialRecurrenceFormComponent> {
  override state = inject(FinancialRecurrenceState);
  override service = inject(FinancialRecurrenceService);

  override header: string = "Recorrência Financeira";
  override component: Type<any> = FinancialRecurrenceFormComponent;
  override dialogSize: DialogContentVariants["size"] = "lg";
  override dialogAlign: DialogContentVariants["align"] = "center";
  override closeOnSave: boolean = false;

  override recordSchema: PllFormSchemaConfig<FinancialRecurrence> = {
    fields: {
      id: { value: null },
      recurrenceId: { value: null },
      centerOfCostId: { value: null, validators: [Validators.required] },
      planOfAccountId: { value: null, validators: [Validators.required] },
      secrecyId: { value: null, validators: [Validators.required] },
      bankAccountId: { value: null, validators: [Validators.required] },
      type: { value: "PAYABLE", validators: [Validators.required] },
      name: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      value: { value: 0, validators: [Validators.required, Validators.min(0)] },
      date: { value: new Date(), validators: [Validators.required] },
      description: { value: null },
      createdAt: { value: new Date(), validators: [Validators.required], disabled: true },
      active: { value: true },
    },
  };
};

@Injectable({ providedIn: "root" })
export class FinancialRecurrenceQueryFacade extends PllQueryFacade<FinancialRecurrenceUQR, FinancialRecurrenceUQP> {
  override service = inject(FinancialRecurrenceService);
  override queryFn = (params: FinancialRecurrenceUQP) => this.service.getAllByFilter(params);

  override filterSchema: PllFormSchemaConfig<FinancialRecurrenceUQP> = {
    fields: {
      status: { value: "ACTIVE" },
    },
  };
};