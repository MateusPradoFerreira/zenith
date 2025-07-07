import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { Inbox, InboxStatus } from '../../../models/inbox.model';
import { GetAllInboxByFilterParams } from '../../../services/inbox.service';
import { InboxFacade, InboxPriorityOptions, InboxStatusOptions } from '../../../facades/inbox.facade';
import { HlmDataTableActionFc, HlmDataTableColumn, HlmDataTableComponent, HlmDataTableSelectionActionFc } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import { PayableFacade } from '../../../../financial/facades/payable.facade';
import { ReceivableFacade } from '../../../../financial/facades/receivable.facade';

@Component({
  standalone: true,
  selector: 'app-inbox-listing',
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: './inbox-listing.component.html',
})
export class InboxListingComponent extends BaseRecordListingComponentDirective<Inbox, GetAllInboxByFilterParams> {
  payableFacade = inject(PayableFacade);
  receivableFacade = inject(ReceivableFacade);

  override facade = inject(InboxFacade);
  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "Title", class: "flex-1" },
    { header: "Status", class: "w-38 2xl:w-48" },
    { header: "Prioridade", class: "w-38 2xl:w-48" },
    { header: "Lançamento", class: "w-38 2xl:w-48" },
    { header: "Vencimento", class: "w-38 2xl:w-48" },
  ]);

  override actionFn: HlmDataTableActionFc<Inbox> = (data: Inbox) => ([
    { icon: "pencil-line", label: "Editar", command: () => this.handleUpdate(data) },
    { icon: "list-todo", label: "Processar", command: () => this.changeStatus(data, "PROCESSED") },
    { separator: true },
    { icon: "circle-fading-arrow-up", label: "Converter em", items: [
      { icon: "calendar", label: "Agendamento", command: () => this.changeStatus(data, "PROCESSED") },
      { icon: "square-kanban", label: "Projeto", command: () => this.changeStatus(data, "PROCESSED") },
      { separator: true },
      { icon: "banknote-arrow-down", label: "Despesa", command: () => this.convertRecordIn(data, "PAYABLE") },
      { icon: "banknote-arrow-up", label: "Receita", command: () => this.convertRecordIn(data, "RECEIVABLE") },
      { icon: "clock-fading", label: "Recorrência", command: () => this.changeStatus(data, "PROCESSED") },
    ]},
    { separator: true },
    { icon: "circle-x", label: "Cancelar", command: () => this.changeStatus(data, "CANCELLED") },
    { icon: "trash-2", label: "Excluir", command: () => this.handleDelete(data) },
  ]);

  override selectionActionFn: HlmDataTableSelectionActionFc<Inbox> = (data: Inbox[]) => ([
    { icon: "list-todo", label: "Processar", command: () => this.changeManyStatus(data, "PROCESSED") },
    { separator: true },
    { icon: "circle-x", label: "Cancelar", command: () => this.changeManyStatus(data, "CANCELLED") },
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

  changeStatus(rowData: Inbox, status: InboxStatus) {
    this.facade.changeStatus(rowData, status).subscribe({
      next: () => this.updateUI(),
      error: error => console.log(error),
    });
  };

  changeManyStatus(rows: Inbox[], status: InboxStatus) {
    this.facade.changeManyStatus(rows, status).subscribe({
      next: () => this.updateUI(),
      error: error => console.log(error),
    });
  };

  convertRecordIn(rowData: Inbox, to: "PAYABLE" | "RECEIVABLE") {
    if(to === "PAYABLE") {
      this.payableFacade.openToCreate({ name: rowData.title }).subscribe(response => {
        if(response) this.changeStatus(rowData, "PROCESSED");
      });
    } else if(to == "RECEIVABLE") {
      this.receivableFacade.openToCreate({ name: rowData.title }).subscribe(response => {
        if(response) this.changeStatus(rowData, "PROCESSED");
      });
    };
  };
};