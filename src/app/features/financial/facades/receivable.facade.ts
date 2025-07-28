import { inject, Injectable, Type } from "@angular/core";
import { PllFacade, PllID } from "../../../core/lib/pollaris";
import { Receivable } from "../models/receivable.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "../../../core/lib/pollaris/forms/refiners";
import { GetAllReceivableByFilterParams, GetAllReceivableByFilterResponse, ReceivableService } from "../services/receivable.service";
import { ReceivableState } from "../states/receivable.state";
import { ReceivableMapper } from "../mappers/receivable.mapper";
import { DialogWidth } from "../../../common/facades/dialog.facade";
import moment from "moment";
import { SelectItem } from "../../../common/types/select-item.type";
import { ReceivableFormComponent } from "../views/receivable/receivable-form/receivable-form.component";
import { Observable, Subject } from "rxjs";

export type ReceivableUseQueryParams = GetAllReceivableByFilterParams;
export type ReceivableUseQueryResponse = GetAllReceivableByFilterResponse;

@Injectable({ providedIn: "root" })
export class ReceivableFacade extends PllFacade<Receivable, Receivable, ReceivableUseQueryResponse, ReceivableUseQueryParams, ReceivableFormComponent> {
  override state = inject(ReceivableState);
  override service = inject(ReceivableService);
  override mapper = inject(ReceivableMapper);
  override queryFn = (params: ReceivableUseQueryParams) => this.service.getAllByFilter(params);

  override header: string = "Receita";
  override component: Type<any> = ReceivableFormComponent;
  override dialogWidth: DialogWidth = "lg";
  override closeOnSave: boolean = false;

  override recordSchema: PllFormSchemaConfig<Receivable> = {
    fields: {
      id: { value: null },
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
      description: { value: null },
      docNumber: { value: "0000000000-000", validators: [Validators.required, Validators.min(0)], disabled: true },
      sequence: { value: 0, validators: [Validators.required, Validators.min(0)], disabled: true },
      value: { value: 0, validators: [Validators.required, Validators.min(0)] },
    },
  };

  override filterSchema: PllFormSchemaConfig<ReceivableUseQueryParams> = {
    fields: {
      status: { value: "TOPAY" },
      centerOfCostId: { value: null },
      planOfAccountId: { value: null },
      secrecyId: { value: null },
      startsAt: { value: moment().startOf("month").toDate(), validators: [Validators.required] },
      endsAt: { value: moment().endOf("month").toDate(), validators: [Validators.required] },
    },
  };
  
  handlePay(id: PllID): Observable<Receivable> {
    const sub$ = new Subject<Receivable>();
    this.dialogFacade.confirm({ 
      header: "Confirmar Recebimento?",
      severity: "success",
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
    }).closed$.subscribe(res => {
      if(!res?.status) sub$.complete();
    });
    return sub$.asObservable();
  };

  handleCancel(id: PllID): Observable<Receivable> {
    const sub$ = new Subject<Receivable>();
    this.dialogFacade.confirm({ 
      header: "Cancelar Receita?",
      severity: "danger",
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
    }).closed$.subscribe(res => {
      if(!res?.status) sub$.complete();
    });
    return sub$.asObservable();
  };

  handleReopen(id: PllID): Observable<Receivable> {
    const sub$ = new Subject<Receivable>();
    this.dialogFacade.confirm({ 
      header: "Reabrir Receita?",
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
    }).closed$.subscribe(res => {
      if(!res?.status) sub$.complete();
    });
    return sub$.asObservable();
  };
};

export const ReceivableStatusOptions: SelectItem[] = [
  { label: "Pendente", value: "PENDING" },
  { label: "Recebido", value: "PAID" },
  { label: "Vencido", value: "OVERDUE" },
  { label: "Cancelado", value: "CANCELLED" },
];