import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { ReceivableFacade, ReceivableQueryFacade, ReceivableStatusOptions, ReceivableUseQueryParams, ReceivableUseQueryResponse } from '../../../facades/receivable.facade';
import { HlmDataTableActionFc, HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import { Secrecy } from '../../../models/secrecy.model';
import { CenterOfCost } from '../../../models/center-of-cost.model';
import { PlanOfAccount } from '../../../models/plan-of-account.model';
import { PllID } from '../../../../../core/lib/pollaris';
import { BankAccount } from '../../../models/bank-account.model';
import { ReceivableFormComponent } from '../receivable-form/receivable-form.component';

@Component({
  standalone: true,
  selector: 'app-receivable-listing',
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: './receivable-listing.component.html',
})
export class ReceivableListingComponent extends BaseRecordListingComponentDirective<ReceivableUseQueryResponse, ReceivableUseQueryParams, ReceivableFormComponent> {
  override facade = inject(ReceivableFacade);
  override queryFacade = inject(ReceivableQueryFacade);
  
  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "N° Doc.", class: "w-44" },
    { header: "Title", class: "flex-1" },
    { header: "Conta Bancária", class: "w-42" },
    { header: "Centro de Custo", class: "w-42" },
    { header: "Plano de Conta", class: "w-42" },
    { header: "Valor", class: "w-36 justify-end" },
    { header: "Status", class: "w-36" },
    { header: "Emissão", class: "w-36" },
    { header: "Vencimento", class: "w-36" },
  ]);

  override actionFn: HlmDataTableActionFc<ReceivableUseQueryResponse> = (data: ReceivableUseQueryResponse) => ([
    { icon: "pencil-line", label: "Editar", command: () => this.handleUpdate(data) },
    { icon: "dollar-sign", label: "Receber", command: () => this.handlePay(data.id), visible: data.status !== "PAID" },
    { separator: true, visible: data.status !== "PAID" },
    { icon: "circle-x", label: "Cancelar", command: () => this.handleCancel(data.id), visible: data.status !== "CANCELLED" && data.status !== "PAID" },
    { icon: "check", label: "Reabrir", command: () => this.handleReopen(data.id), visible: data.status === "CANCELLED" },
  ]);

  secrecyOptions: Secrecy[] = [];
  centerOfCostOptions: CenterOfCost[] = [];
  planOfAccountOptions: PlanOfAccount[] = [];
  bankAccountOptions: BankAccount[] = [];

  statusOptions = [
    { label: "Todos", value: "ALL" },
    { label: "A Pagar", value: "TOPAY" },
    ...ReceivableStatusOptions,
  ];

  formatSequence(number: number): string {
    return number.toString().padStart(4, "0");
  };

  handlePay(id: PllID) {
    this.processing.set(false),
    this.facade.handlePay(id).subscribe({
      next: () => this.updateUI(),
      error: error => console.error(error),
      complete: () => this.processing.set(false),
    });
  };

  handleCancel(id: PllID) {
    this.processing.set(false),
    this.facade.handleCancel(id).subscribe({
      next: () => this.updateUI(),
      error: error => console.error(error),
      complete: () => this.processing.set(false),
    });
  };

  handleReopen(id: PllID) {
    this.processing.set(false),
    this.facade.handleReopen(id).subscribe({
      next: () => this.updateUI(),
      error: error => console.error(error),
      complete: () => this.processing.set(false),
    });
  };
};