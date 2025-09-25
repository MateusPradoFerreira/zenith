import { inject, Injectable, Type } from "@angular/core";
import { PllFacade, PllID } from "../../../core/lib/pollaris";
import { Inbox, InboxStatus } from "../models/inbox.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "../../../core/lib/pollaris/forms/refiners";
import { GetAllInboxByFilterParams, InboxService } from "../services/inbox.service";
import { InboxState } from "../states/inbox.state";
import { InboxFormComponent } from "../views/inbox/inbox-form/inbox-form.component";
import moment from "moment";
import { Observable, Subject, tap } from "rxjs";
import { SelectItem } from "../../../common/types/select-item.type";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";

export type InboxUseQueryParams = GetAllInboxByFilterParams;

export class InboxFacade extends PllFacade<Inbox, Inbox, InboxUseQueryParams, InboxFormComponent> {
  override state = inject(InboxState);
  override service = inject(InboxService);
  override queryFn = (params: InboxUseQueryParams) => this.service.getAllByFilter(params);

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
      cancelledAt: { value: null, disabled: true },
      processedAt: { value: null, disabled: true },
    },
  };

  override filterSchema: PllFormSchemaConfig<InboxUseQueryParams> = {
    fields: {
      status: { value: "TOMAKE" },
      priority: { value: "ALL" },
      startsAt: { value: moment().startOf("month").toDate(), validators: [Validators.required] },
      endsAt: { value: moment().endOf("month").toDate(), validators: [Validators.required] },
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