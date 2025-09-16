import { inject, Injectable, Type } from "@angular/core";
import { PllFacade } from "../../../core/lib/pollaris";
import { Inbox, InboxStatus } from "../models/inbox.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "../../../core/lib/pollaris/forms/refiners";
import { GetAllInboxByFilterParams, InboxService } from "../services/inbox.service";
import { InboxState } from "../states/inbox.state";
import { InboxFormComponent } from "../views/inbox/inbox-form/inbox-form.component";
import moment from "moment";
import { Observable, Subject } from "rxjs";
import { SelectItem } from "../../../common/types/select-item.type";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";

export type InboxUseQueryParams = GetAllInboxByFilterParams;

@Injectable({ providedIn: "root" })
export class InboxFacade extends PllFacade<Inbox, Inbox, InboxUseQueryParams, InboxFormComponent> {
  override state = inject(InboxState);
  override service = inject(InboxService);
  override queryFn = (params: InboxUseQueryParams) => this.service.getAllByFilter(params);

  override header: string = "Inbox";
  override component: Type<any> = InboxFormComponent;
  override dialogSize: DialogContentVariants["size"] = "lg";
  override dialogAlign: DialogContentVariants["align"] = "center";
  override closeOnSave: boolean = true;

  override recordSchema: PllFormSchemaConfig<Inbox> = {
    fields: {
      id: { value: null },
      title: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      status: { value: "PENDING" },
      priority: { value: "MEDIUM" },
      dueAt: { value: new Date() },
      createdAt: { value: new Date() },
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

  changeStatus(record: Inbox, status: InboxStatus): Observable<Inbox> {
    return this.updateRecord({ ...record, status });
  };

  changeManyStatus(records: Inbox[], status: InboxStatus): Observable<Inbox[]> {
    return this.updateManyRecords(records.map(record => ({ ...record, status })));
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