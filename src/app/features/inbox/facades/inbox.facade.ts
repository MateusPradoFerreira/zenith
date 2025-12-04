import { inject, Injectable, Type } from "@angular/core";
import { PllFacade, PllID, PllQueryFacade } from "@pollaris";
import { Inbox } from "../models/inbox.model";
import { PllFormSchemaConfig } from "@pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "@pollaris/forms/refiners";
import { InboxViewParams, InboxService } from "../services/inbox.service";
import { InboxState } from "../states/inbox.state";
import { InboxFormComponent } from "../views/inbox/inbox-form/inbox-form.component";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";
import { Observable, tap } from "rxjs";
import moment from "moment";
import { SelectItem } from "../../../common/types/select-item.type";

export type InboxUQP = InboxViewParams;
export type InboxUQR = Inbox;

@Injectable({ providedIn: "root" })
export class InboxFacade extends PllFacade<Inbox, InboxFormComponent> {
  override state = inject(InboxState);
  override service = inject(InboxService);

  override header: string = "Inbox";
  override component: Type<any> = InboxFormComponent;
  override dialogSize: DialogContentVariants["size"] = "md";
  override dialogAlign: DialogContentVariants["align"] = "center";
  override closeOnSave: boolean = true;

  override recordSchema: PllFormSchemaConfig<Inbox> = {
    fields: {
      id: { value: null },
      title: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      status: { value: "PENDING" },
      priority: { value: "MEDIUM" },
      dueAt: { value: new Date() },
      createdAt: { value: new Date(), disabled: true },
      cancelledAt: { value: null, disabled: true, onChange: (value, form) => {
        if(!value) return;
        form.controls.dueAt.disable();
        form.controls.priority.disable();
      }},
      processedAt: { value: null, disabled: true, onChange: (value, form) => {
        if(!value) return;
        form.controls.dueAt.disable();
        form.controls.priority.disable();
      }},
    },
  };

  handleProcess(id: PllID): Observable<Inbox> {
    return this.dialogFacade.confirmRequest(this.service.process(id), "Processar Inbox?", "success").pipe(tap(() => this.state.remove(id)));
  };

  handleCancel(id: PllID): Observable<Inbox> {
    return this.dialogFacade.confirmRequest(this.service.cancel(id), "Cancelar Inbox?", "danger").pipe(tap(() => this.state.remove(id)));
  };

  handleReopen(id: PllID): Observable<Inbox> {
    return this.dialogFacade.confirmRequest(this.service.reopen(id), "Reabrir Inbox?", "info").pipe(tap(() => this.state.remove(id)));
  };
};

@Injectable({ providedIn: "root" })
export class InboxQueryFacade extends PllQueryFacade<InboxUQR, InboxUQP> {
  override service = inject(InboxService);
  override queryFn = (params: InboxUQP) => this.service.getAllByFilter(params);

  override filterSchema: PllFormSchemaConfig<InboxUQP> = {
    fields: {
      status: { value: "TOMAKE" },
      priority: { value: "ALL" },
      startsAt: { value: moment().startOf("month").toDate(), validators: [Validators.required] },
      endsAt: { value: moment().endOf("month").toDate(), validators: [Validators.required] },
    },
  };
};

export const InboxStatusOptions: SelectItem[] = [
  { label: "Pendente", value: "PENDING" },
  { label: "Processado", value: "PROCESSED" },
  { label: "Vencido", value: "OVERDUE" },
  { label: "Cancelado", value: "CANCELLED" },
];

export const InboxPriorityOptions: SelectItem[] = [
  { label: "Baixa", value: "LOW"  },
  { label: "Média", value: "MEDIUM" },
  { label: "Alta", value: "HIGH" },
];