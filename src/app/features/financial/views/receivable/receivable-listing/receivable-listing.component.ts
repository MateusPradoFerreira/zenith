import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { Receivable } from '../../../models/receivable.model';
import { GetAllReceivableByFilterParams } from '../../../services/receivable.service';
import { ReceivableFacade, ReceivableStatusOptions } from '../../../facades/receivable.facade';
import { HlmDataTableActionFc, HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import { forkJoin, switchMap, tap } from 'rxjs';
import { event } from '../../../../../common/directives/base-form-component.directive';
import { Secrecy } from '../../../models/secrecy.model';
import { CenterOfCost } from '../../../models/center-of-cost.model';
import { PlanOfAccount } from '../../../models/plan-of-account.model';
import { SecrecyFacade } from '../../../facades/secrecy.facade';
import { CenterOfCostFacade } from '../../../facades/center-of-cost.facade';
import { PlanOfAccountFacade } from '../../../facades/plan-of-account.facade';
import { PllID } from '../../../../../core/lib/pollaris';
import { BankAccount } from '../../../models/bank-account.model';
import { BankAccountFacade } from '../../../facades/bank-account.facade';

@Component({
  standalone: true,
  selector: 'app-receivable-listing',
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: './receivable-listing.component.html',
})
export class ReceivableListingComponent extends BaseRecordListingComponentDirective<Receivable, GetAllReceivableByFilterParams> {
  override facade = inject(ReceivableFacade);
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

  override actionFn: HlmDataTableActionFc<Receivable> = (data: Receivable) => ([
    { icon: "pencil-line", label: "Editar", disabled: this.processing(), command: () => this.handleUpdate(data) },
    { icon: "dollar-sign", label: "Receber", disabled: this.processing(), command: () => this.handlePay(data.id), visible: data.status !== "PAID" },
    { separator: true, visible: data.status !== "PAID" },
    { icon: "circle-x", label: "Cancelar", disabled: this.processing(), command: () => this.handleCancel(data.id), visible: data.status !== "CANCELLED" && data.status !== "PAID" },
    { icon: "check", label: "Reabrir", disabled: this.processing(), command: () => this.handleReopen(data.id), visible: data.status === "CANCELLED" },
  ]);

  secrecyFacade = inject(SecrecyFacade);
  centerOfCostFacade = inject(CenterOfCostFacade);
  planOfAccountFacade = inject(PlanOfAccountFacade);
  bankAccountFacade = inject(BankAccountFacade);

  secrecyOptions: Secrecy[] = [];
  centerOfCostOptions: CenterOfCost[] = [];
  planOfAccountOptions: PlanOfAccount[] = [];
  bankAccountOptions: BankAccount[] = [];
  statusOptions = [
    { label: "Todos", value: "ALL" },
    { label: "A Receber", value: "TOPAY" },
    ...ReceivableStatusOptions,
  ];

  override onNgOnInit = event(switchMap(() => forkJoin({
    handleGetSecrecyOptions: this.handleGetSecrecyOptions(),
    handleGetCenterOfCostOptions: this.handleGetCenterOfCostOptions(),
    handleGetPlanOfAccountOptions: this.handleGetPlanOfAccountOptions(),
    handleGetBankAccountOptions: this.handleGetBankAccountOptions(),
  })));
  
  handleGetSecrecyOptions = () => this.secrecyFacade.service.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => {
    this.secrecyOptions = response.data;
    this.secrecyOptions.unshift(new Secrecy({ name: "Todos", id: null }));
  }));

  handleGetCenterOfCostOptions = () => this.centerOfCostFacade.service.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => { 
    this.centerOfCostOptions = response.data;
    this.centerOfCostOptions.unshift(new CenterOfCost({ name: "Todos", id: null }));
  }));

  handleGetPlanOfAccountOptions = () => this.planOfAccountFacade.service.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => { 
    this.planOfAccountOptions = response.data;
    this.planOfAccountOptions.unshift(new PlanOfAccount({ name: "Todos", id: null }));
  }));

  handleGetBankAccountOptions = () => this.bankAccountFacade.service.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => { 
    this.bankAccountOptions = response.data;
    this.bankAccountOptions.unshift(new PlanOfAccount({ name: "Todas", id: null }));
  }));

  formatSequence(number: number): string {
    return number.toString().padStart(4, '0');
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