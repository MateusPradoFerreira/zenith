import { inject, Injectable, Type } from "@angular/core";
import { PllFacade, PllID, PllQueryFacade } from "@pollaris";
import { Receivable } from "../models/receivable.model";
import { PllFormSchemaConfig } from "@pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "@pollaris/forms/refiners";
import { GetAllReceivableByFilterParams, GetAllReceivableByFilterResponse, ReceivableService } from "../services/receivable.service";
import { ReceivableState } from "../states/receivable.state";
import { SelectItem } from "../../../common/types/select-item.type";
import { ReceivableFormComponent } from "../views/receivable/receivable-form/receivable-form.component";
import { Observable, tap } from "rxjs";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";
import moment from "moment";

export type ReceivableUseQueryParams = GetAllReceivableByFilterParams;
export type ReceivableUseQueryResponse = GetAllReceivableByFilterResponse;

@Injectable({ providedIn: "root" })
export class ReceivableFacade extends PllFacade<Receivable, ReceivableFormComponent> {
  override state = inject(ReceivableState);
  override service = inject(ReceivableService);

  override header: string = "Receita";
  override component: Type<any> = ReceivableFormComponent;
  override dialogSize: DialogContentVariants["size"] = "lg";
  override dialogAlign: DialogContentVariants["align"] = "center";
  override closeOnSave: boolean = false;

  override recordSchema: PllFormSchemaConfig<Receivable> = {
    fields: {
      id: { value: null },
      financialRecurrenceId: { value: null },
      name: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      status: { value: "PENDING", validators: [Validators.required], onChange: (value, form) => {
        if(value === "PAID" || value === "CANCELLED") {
          form.controls.dueAt.disable();
          form.controls.createdAt.disable();
          form.controls.value.disable();
          form.controls.bankAccountId.disable();
          form.controls.planOfAccountId.disable();
          form.controls.centerOfCostId.disable();
          form.controls.secrecyId.disable();
          return;
        };

        form.controls.dueAt.enable();
        form.controls.createdAt.enable();
        form.controls.value.enable();
        form.controls.bankAccountId.enable();
        form.controls.planOfAccountId.enable();
        form.controls.centerOfCostId.enable();
        form.controls.secrecyId.enable();
      }},
      dueAt: { value: new Date(), validators: [Validators.required] },
      paidAt: { value: null, disabled: true },
      createdAt: { value: new Date(), validators: [Validators.required] },
      cancelledAt: { value: null, validators: [Validators.required], disabled: true },
      active: { value: true },
      centerOfCostId: { value: null, validators: [Validators.required] },
      planOfAccountId: { value: null, validators: [Validators.required] },
      secrecyId: { value: null, validators: [Validators.required] },
      bankAccountId: { value: null, validators: [Validators.required] },
      description: { value: null },
      docNumber: { value: "0000000000", validators: [Validators.required, Validators.min(0)], disabled: true },
      sequence: { value: 0, validators: [Validators.required, Validators.min(0)], disabled: true },
      value: { value: 0, validators: [Validators.required, Validators.min(0)] },
    },
  };

  handlePay(id: PllID): Observable<Receivable> {
    return this.dialogFacade.confirmRequest(this.service.pay(id), "Confirmar Pagamento?", "success").pipe(tap(() => this.state.remove(id)));
  };

  handleCancel(id: PllID): Observable<Receivable> {
    return this.dialogFacade.confirmRequest(this.service.cancel(id), "Cancelar Despesa?", "danger").pipe(tap(() => this.state.remove(id)));
  };

  handleReopen(id: PllID): Observable<Receivable> {
    return this.dialogFacade.confirmRequest(this.service.reopen(id), "Reabrir Despesa?", "info").pipe(tap(() => this.state.remove(id)));
  };
};

@Injectable({ providedIn: "root" })
export class ReceivableQueryFacade extends PllQueryFacade<ReceivableUseQueryResponse, ReceivableUseQueryParams> {
  override service = inject(ReceivableService);
  override queryFn = (params: ReceivableUseQueryParams) => this.service.getAllByFilter(params);

  override filterSchema: PllFormSchemaConfig<ReceivableUseQueryParams> = {
    fields: {
      status: { value: "TOPAY" },
      centerOfCostId: { value: null },
      planOfAccountId: { value: null },
      bankAccountId: { value: null },
      secrecyId: { value: null },
      startsAt: { value: moment().startOf("month").toDate(), validators: [Validators.required] },
      endsAt: { value: moment().endOf("month").toDate(), validators: [Validators.required] },
    },
  };
};

export const ReceivableStatusOptions: SelectItem[] = [
  { label: "Pendente", value: "PENDING" },
  { label: "Recebido", value: "PAID" },
  { label: "Vencido", value: "OVERDUE" },
  { label: "Cancelado", value: "CANCELLED" },
];