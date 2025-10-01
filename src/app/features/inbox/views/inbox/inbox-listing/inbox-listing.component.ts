import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { Inbox } from '../../../models/inbox.model';
import { GetAllInboxByFilterParams } from '../../../services/inbox.service';
import { InboxFacade, InboxPriorityOptions, InboxQueryFacade, InboxStatusOptions } from '../../../facades/inbox.facade';
import { HlmDataTableActionFc, HlmDataTableColumn, HlmDataTableComponent, HlmDataTableSelectionActionFc } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import { PllID } from '@pollaris';

@Component({
  standalone: true,
  selector: 'app-inbox-listing',
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: './inbox-listing.component.html',
})
export class InboxListingComponent extends BaseRecordListingComponentDirective<Inbox, GetAllInboxByFilterParams> {
  override facade = inject(InboxFacade);
  override queryFacade = inject(InboxQueryFacade);

  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "Title", class: "flex-1" },
    { header: "Status", class: "w-38 2xl:w-48" },
    { header: "Prioridade", class: "w-38 2xl:w-48" },
    { header: "Lançamento", class: "w-38 2xl:w-48" },
    { header: "Vencimento", class: "w-38 2xl:w-48" },
  ]);

  override actionFn: HlmDataTableActionFc<Inbox> = (data: Inbox) => ([
    { icon: "pencil-line", label: "Editar", command: () => this.handleUpdate(data) },
    { icon: "list-todo", label: "Processar", command: () => this.handleProcess(data.id), visible: data.status === "PENDING" || data.status === "OVERDUE" },
    { separator: true, visible: data.status === "PENDING" || data.status === "OVERDUE" },
    { icon: "circle-fading-arrow-up", label: "Converter em", visible: data.status === "PENDING" || data.status === "OVERDUE", children: [
      { icon: "calendar", label: "Agendamento", command: () => this.convertRecordIn(data, "SCHEDULE") },
      { icon: "square-kanban", label: "Projeto" },
      { separator: true },
      { icon: "banknote-arrow-down", label: "Despesa", command: () => this.convertRecordIn(data, "PAYABLE") },
      { icon: "banknote-arrow-up", label: "Receita", command: () => this.convertRecordIn(data, "RECEIVABLE") },
      { icon: "clock-fading", label: "Recorrência" },
    ]},
    { separator: true },
    { icon: "circle-x", label: "Cancelar", command: () => this.handleCancel(data.id), visible: data.status !== "CANCELLED" },
    { icon: "check", label: "Reabrir", command: () => this.handleReopen(data.id), visible: data.status === "CANCELLED" },
    { icon: "trash-2", label: "Excluir", command: () => this.handleDelete(data), visible: data.status === "CANCELLED" },
  ]);

  override selectionActionFn: HlmDataTableSelectionActionFc<Inbox> = (data: Inbox[]) => ([
    { icon: "list-todo", label: "Processar" },
    { separator: true },
    { icon: "circle-x", label: "Cancelar" },
    { icon: "trash-2", label: "Excluir", command: () => this.handleDeleteMany(data) },
  ]);

  statusOptions = [
    { label: "Todos", value: "ALL" },
    { label: "A Fazer", value: "TOMAKE" },
    ...InboxStatusOptions,
  ];

  priorityOptions = [
    { label: "Todos", value: "ALL" },
    ...InboxPriorityOptions,
  ];

  convertRecordIn(rowData: Inbox, to: "PAYABLE" | "RECEIVABLE" | "SCHEDULE") {

  };

  handleProcess(id: PllID) {
    this.processing.set(true),
    this.facade.handleProcess(id).subscribe({
      next: () => this.updateUI(),
      error: error => console.error(error),
      complete: () => this.processing.set(false),
    });
  };

  handleCancel(id: PllID) {
    this.processing.set(true),
    this.facade.handleCancel(id).subscribe({
      next: () => this.updateUI(),
      error: error => console.error(error),
      complete: () => this.processing.set(false),
    });
  };

  handleReopen(id: PllID) {
    this.processing.set(true),
    this.facade.handleReopen(id).subscribe({
      next: () => this.updateUI(),
      error: error => console.error(error),
      complete: () => this.processing.set(false),
    });
  };
};