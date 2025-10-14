import { inject, Injectable, Type } from "@angular/core";
import { PllFacade, PllID, PllQueryFacade } from "@pollaris";
import { Payable } from "../models/payable.model";
import { PllFormSchemaConfig } from "@pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "@pollaris/forms/refiners";
import { GetAllPayableByFilterParams, GetAllPayableByFilterResponse, PayableService } from "../services/payable.service";
import { PayableState } from "../states/payable.state";
import { SelectItem } from "../../../common/types/select-item.type";
import { PayableFormComponent } from "../views/payable/payable-form/payable-form.component";
import { Observable, tap } from "rxjs";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";
import moment from "moment";

export type PayableUseQueryParams = GetAllPayableByFilterParams;
export type PayableUseQueryResponse = GetAllPayableByFilterResponse;

@Injectable({ providedIn: "root" })
export class PayableFacade extends PllFacade<Payable, PayableFormComponent> {
  override state = inject(PayableState);
  override service = inject(PayableService);

  override header: string = "Despesa";
  override component: Type<any> = PayableFormComponent;
  override dialogSize: DialogContentVariants["size"] = "lg";
  override dialogAlign: DialogContentVariants["align"] = "center";
  override closeOnSave: boolean = false;

  override recordSchema: PllFormSchemaConfig<Payable> = {
    fields: {
      id: { value: null },
      financialRecurrenceId: { value: null },
      name: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      status: { value: "PENDING", validators: [Validators.required], onChange: (value, form) => {
        if(value === "PAID" || value === "CANCELLED") {
          form.controls.dueAt.disable();
          form.controls.createdAt.disable();
          form.controls.value.disable();
          return;
        };

        form.controls.dueAt.enable();
        form.controls.createdAt.enable();
        form.controls.value.enable();
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
      docNumber: { value: "0000000000-000", validators: [Validators.required, Validators.min(0)], disabled: true },
      sequence: { value: 0, validators: [Validators.required, Validators.min(0)], disabled: true },
      value: { value: 0, validators: [Validators.required, Validators.min(0)] },
    },
  };

  handlePay(id: PllID): Observable<Payable> {
    return this.dialogFacade.confirmRequest(this.service.pay(id), "Confirmar Pagamento?", "success").pipe(tap(() => this.state.remove(id)));
  };

  handleCancel(id: PllID): Observable<Payable> {
    return this.dialogFacade.confirmRequest(this.service.cancel(id), "Cancelar Despesa?", "danger").pipe(tap(() => this.state.remove(id)));
  };

  handleReopen(id: PllID): Observable<Payable> {
    return this.dialogFacade.confirmRequest(this.service.reopen(id), "Reabrir Despesa?", "info").pipe(tap(() => this.state.remove(id)));
  };
};

@Injectable({ providedIn: "root" })
export class PayableQueryFacade extends PllQueryFacade<PayableUseQueryResponse, PayableUseQueryParams> {
  override service = inject(PayableService);
  override queryFn = (params: PayableUseQueryParams) => this.service.getAllByFilter(params);

  override filterSchema: PllFormSchemaConfig<PayableUseQueryParams> = {
    fields: {
      status: { value: "TOPAY" },
      centerOfCostId: { value: null },
      planOfAccountId: { value: null },
      bankAccountId: { value: null },
      secrecyId: { value: null },
      startsAt: { value: moment().startOf("month").toDate() },
      endsAt: { value: moment().endOf("month").toDate() },
    },
  };
};

export const PayableStatusOptions: SelectItem[] = [
  { label: "Pendente", value: "PENDING" },
  { label: "Pago", value: "PAID" },
  { label: "Vencido", value: "OVERDUE" },
  { label: "Cancelado", value: "CANCELLED" },
];