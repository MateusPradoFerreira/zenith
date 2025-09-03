import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { CashFlow } from '../../../models/cash-flow.model';
import { GetAllCashFlowByFilterParams } from '../../../services/cash-flow.service';
import { CashFlowFacade } from '../../../facades/cash-flow.facade';
import { HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import { event, EventObs } from '../../../../../common/directives/base-form-component.directive';
import { forkJoin, switchMap, tap } from 'rxjs';
import moment from 'moment';
import { PllPaginatedResponse } from '@pollaris';
import { CashFlowTreeTrowComponent } from '../../../components/cash-flow-tree-trow.component';
import { SecrecyFacade } from '../../../facades/secrecy.facade';
import { CenterOfCostFacade } from '../../../facades/center-of-cost.facade';
import { PlanOfAccountFacade } from '../../../facades/plan-of-account.facade';
import { Secrecy } from '../../../models/secrecy.model';
import { CenterOfCost } from '../../../models/center-of-cost.model';
import { PlanOfAccount } from '../../../models/plan-of-account.model';
import { BankAccount } from '../../../models/bank-account.model';
import { BankAccountFacade } from '../../../facades/bank-account.facade';
import { CashFlowChartCardComponent } from '../../../components/cash-flow-chart-card.component';

@Component({
  standalone: true,
  selector: 'app-cash-flow-listing',
  imports: [GlobalModule, HlmDataTableComponent, CashFlowTreeTrowComponent, CashFlowChartCardComponent],
  templateUrl: './cash-flow-listing.component.html',
})
export class CashFlowListingComponent extends BaseRecordListingComponentDirective<CashFlow, GetAllCashFlowByFilterParams> {
  override facade = inject(CashFlowFacade);
  override columns: WritableSignal<HlmDataTableColumn[]> = signal([]);

  secrecyFacade = inject(SecrecyFacade);
  centerOfCostFacade = inject(CenterOfCostFacade);
  planOfAccountFacade = inject(PlanOfAccountFacade);
  bankAccountFacade = inject(BankAccountFacade);

  secrecyOptions: Secrecy[] = [];
  centerOfCostOptions: CenterOfCost[] = [];
  planOfAccountOptions: PlanOfAccount[] = [];
  bankAccountOptions: BankAccount[] = [];

  payableValues = computed(() => this.values().find(cf => cf.type === "PAYABLE_MARK")?.values.map(val => val * -1) || []);
  toPayValues = computed(() => this.values().find(cf => cf.type === "PAYABLE_MARK")?.values.map(val => val * -1? (val * -1 / 2) * 0.3 : 0).reverse() || []);
  receivableValues = computed(() => this.values().find(cf => cf.type === "RECEIVABLE_MARK")?.values  || []);
  rendValues = computed(() => this.values().find(cf => cf.type === "RECEIVABLE_MARK")?.values.map(val => val? (val / 2) * 0.1 : 0)  || []);

  override onNgOnInit = event(tap(() => this.facade.clearData()), switchMap(() => forkJoin({
    handleGetSecrecyOptions: this.handleGetSecrecyOptions(),
    handleGetCenterOfCostOptions: this.handleGetCenterOfCostOptions(),
    handleGetPlanOfAccountOptions: this.handleGetPlanOfAccountOptions(),
    handleGetBankAccountOptions: this.handleGetBankAccountOptions(),
  })));

  override onUpdateUI: EventObs<PllPaginatedResponse<CashFlow>> = event(tap(response => {
    const periods = response.data.shift();
    this.facade.data.set(response);
    this.columns.set([
      { header: "", class: "flex-1" },
      ...periods.values.map(period => ({ header: moment(period).format("MMM YY"), class: "w-29 justify-end" })),
    ]);
  }));

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

  onInputSearch(query: string) {
    this.filter.controls.query.setValue(query);
    this.updateUI();
  };

  onDateChange(date?: Date) {
    this.filter.controls.startsAt.setValue(date || new Date());
    this.updateUI();
  };

  handleSetNextRange() {
    this.filter.controls.startsAt.setValue(moment(this.filter.value.startsAt).add(1, "year").toDate());
    this.updateUI();
  };

  handleSetPrevRange() {
    this.filter.controls.startsAt.setValue(moment(this.filter.value.startsAt).subtract(1, "year").toDate());
    this.updateUI();
  };
};