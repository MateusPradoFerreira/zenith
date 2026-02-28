import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { ReceivableFacade, ReceivableQueryFacade, ReceivableStatusOptions, ReceivableUQP, ReceivableUQR } from '../../../facades/receivable.facade';
import { HlmDataTableActionFc, HlmDataTableColumn, HlmDataTableComponent, HlmDataTableSelectionActionFc } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import { ReceivableFormComponent } from '../receivable-form/receivable-form.component';
import { SelectItem } from '../../../../../common/types/select-item.type';
import { event, EventObs } from '../../../../../common/directives/base-form-component.directive';
import { forkJoin, switchMap, tap } from 'rxjs';
import { SecrecyService } from '../../../services/secrecy.service';
import { CenterOfCostService } from '../../../services/center-of-cost.service';
import { PlanOfAccountService } from '../../../services/plan-of-account.service';
import { BankAccountService } from '../../../services/bank-account.service';
import { PllID } from '@pollaris';

@Component({
  standalone: true,
  selector: 'app-receivable-listing',
  host: {
		role: 'div',
		'[class]': '_computedClass()',
	},
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: './receivable-listing.component.html',
})
export class ReceivableListingComponent extends BaseRecordListingComponentDirective<ReceivableUQR, ReceivableUQP, ReceivableFormComponent> {
  override facade = inject(ReceivableFacade);
  override queryFacade = inject(ReceivableQueryFacade);
  
  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "N° Doc.", class: "w-44" },
    { header: "Nome", class: "flex-1" },
    { header: "Conta Bancária", class: "w-42" },
    { header: "Centro de Custo", class: "w-42" },
    { header: "Plano de Conta", class: "w-42" },
    { header: "Valor", class: "w-36 justify-end" },
    { header: "Status", class: "w-36" },
    { header: "Emissão", class: "w-36" },
    { header: "Vencimento", class: "w-36" },
  ]);

  override actionFn: HlmDataTableActionFc<ReceivableUQR> = (data: ReceivableUQR) => ([
    { icon: "pencil-line", label: "Editar", command: () => this.handleUpdate(data) },
    { icon: "dollar-sign", label: "Receber", command: () => this.handlePay(data.id), visible: data.status !== "PAID" },
    { separator: true, visible: data.status !== "PAID" },
    { icon: "circle-x", label: "Cancelar", command: () => this.handleCancel(data.id), visible: data.status !== "CANCELLED" && data.status !== "PAID" },
    { icon: "check", label: "Reabrir", command: () => this.handleReopen(data.id), visible: data.status === "CANCELLED" },
    { icon: "trash-2", label: "Excluir", command: () => this.handleDelete(data) },
  ]);

  override selectionActionFn: HlmDataTableSelectionActionFc<ReceivableUQR> = (data: ReceivableUQR[]) => ([
    { icon: "trash-2", label: "Excluir", command: () => this.handleDeleteMany(data) },
  ]);

  secrecyService = inject(SecrecyService);
  centerOfCostService = inject(CenterOfCostService);
  planOfAccountService = inject(PlanOfAccountService);
  bankAccountService = inject(BankAccountService);

  secrecyOptions: SelectItem<PllID>[] = [];
  centerOfCostOptions: SelectItem<PllID>[] = [];
  planOfAccountOptions: SelectItem<PllID>[] = [];
  bankAccountOptions: SelectItem<PllID>[] = [];

  override $evNgOnInit: EventObs<void> = event(switchMap(() => forkJoin({
    a: this.$getSecrecyOptions(),
    b: this.$getCenterOfCostOptions(),
    c: this.$getPlanOfAccountOptions(),
    d: this.$getBankAccountOptions(),
  })));

  $getSecrecyOptions = () => this.secrecyService.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => {
    this.secrecyOptions = response.data.map(record => ({ label: record.name, value: record.id }));
    this.secrecyOptions.unshift({ label: "Todos", value: null });
  }));

  $getCenterOfCostOptions = () => this.centerOfCostService.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => {
    this.centerOfCostOptions = response.data.map(record => ({ label: record.name, value: record.id }));
    this.centerOfCostOptions.unshift({ label: "Todos", value: null });
  }));

  $getPlanOfAccountOptions = () => this.planOfAccountService.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => {
    this.planOfAccountOptions = response.data.map(record => ({ label: record.name, value: record.id }));
    this.planOfAccountOptions.unshift({ label: "Todos", value: null });
  }));

  $getBankAccountOptions = () => this.bankAccountService.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => {
    this.bankAccountOptions = response.data.map(record => ({ label: record.name, value: record.id }));
    this.bankAccountOptions.unshift({ label: "Todas", value: null });
  }));

  statusOptions = [
    { label: "Todos", value: "ALL" },
    { label: "A Receber", value: "TOPAY" },
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