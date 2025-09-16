import { inject, Injectable, Type } from "@angular/core";
import { PllFacade, PllID } from "../../../core/lib/pollaris";
import { Payable } from "../models/payable.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "../../../core/lib/pollaris/forms/refiners";
import { GetAllPayableByFilterParams, GetAllPayableByFilterResponse, PayableService } from "../services/payable.service";
import { PayableState } from "../states/payable.state";
import { SelectItem } from "../../../common/types/select-item.type";
import { PayableFormComponent } from "../views/payable/payable-form/payable-form.component";
import { Observable, Subject } from "rxjs";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";
import moment from "moment";

export type PayableUseQueryParams = GetAllPayableByFilterParams;
export type PayableUseQueryResponse = GetAllPayableByFilterResponse;

@Injectable({ providedIn: "root" })
export class PayableFacade extends PllFacade<Payable, PayableUseQueryResponse, PayableUseQueryParams, PayableFormComponent> {
  override state = inject(PayableState);
  override service = inject(PayableService);
  override queryFn = (params: PayableUseQueryParams) => this.service.getAllByFilter(params);

  override header: string = "Despesa";
  override component: Type<any> = PayableFormComponent;
  override dialogSize: DialogContentVariants["size"] = "lg";
  override dialogAlign: DialogContentVariants["align"] = "center";
  override closeOnSave: boolean = false;

  override recordSchema: PllFormSchemaConfig<Payable> = {
    fields: {
      id: { value: null },
      recurrenceId: { value: null },
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

  override filterSchema: PllFormSchemaConfig<PayableUseQueryParams> = {
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

  handlePay(id: PllID): Observable<Payable> {
    const sub$ = new Subject<Payable>();
    this.dialogFacade.confirm({ 
      header: "Confirmar Pagamento?",
      severity: "success",
      events: {
        onConfirm: () => {
          this.service.pay(id).subscribe({
            next: response => {
              this.state.remove(response.id);
              sub$.next(response);
              sub$.complete();
            },
            error: error => sub$.error(error),
          })
        },
        onCancel: () => sub$.complete(),
      },
    }).closed$.subscribe(res => {
      if(!res?.status) sub$.complete();
    });
    return sub$.asObservable();
  };

  handleCancel(id: PllID): Observable<Payable> {
    const sub$ = new Subject<Payable>();
    this.dialogFacade.confirm({ 
      header: "Cancelar Despesa?",
      severity: "danger",
      events: {
        onConfirm: () => {
        this.service.cancel(id).subscribe({
            next: response => {
              this.state.remove(response.id);
              sub$.next(response);
              sub$.complete();
            },
            error: error => sub$.error(error),
          })
        },
        onCancel: () => sub$.complete(),
      },
    }).closed$.subscribe(res => {
      if(!res?.status) sub$.complete();
    });
    return sub$.asObservable();
  };

  handleReopen(id: PllID): Observable<Payable> {
    const sub$ = new Subject<Payable>();
    this.dialogFacade.confirm({ 
      header: "Reabrir Despesa?",
      events: {
        onConfirm: () => {
          this.service.reopen(id).subscribe({
            next: response => {
              this.state.remove(response.id);
              sub$.next(response);
              sub$.complete();
            },
            error: error => sub$.error(error),
          })
        },
        onCancel: () => sub$.complete(),
      },
    }).closed$.subscribe(res => {
      if(!res?.status) sub$.complete();
    });
    return sub$.asObservable();
  };
};

export const PayableStatusOptions: SelectItem[] = [
  { label: "Pendente", value: "PENDING" },
  { label: "Pago", value: "PAID" },
  { label: "Vencido", value: "OVERDUE" },
  { label: "Cancelado", value: "CANCELLED" },
];