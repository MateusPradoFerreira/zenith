import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { CashFlow } from '../../../models/cash-flow.model';
import { GetAllCashFlowByFilterParams } from '../../../services/cash-flow.service';
import { CashFlowFacade, CashFlowQueryFacade } from '../../../facades/cash-flow.facade';
import { HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import { event, EventObs } from '../../../../../common/directives/base-form-component.directive';
import { forkJoin, switchMap, tap } from 'rxjs';
import moment from 'moment';
import { PllID, PllPaginatedResponse } from '@pollaris';
import { CashFlowTreeTrowComponent } from '../../../components/cash-flow-tree-trow.component';
import { CashFlowChartCardComponent } from '../../../components/cash-flow-chart-card.component';
import { SelectItem } from '../../../../../common/types/select-item.type';
import { SecrecyService } from '../../../services/secrecy.service';
import { CenterOfCostService } from '../../../services/center-of-cost.service';
import { PlanOfAccountService } from '../../../services/plan-of-account.service';
import { BankAccountService } from '../../../services/bank-account.service';

@Component({
  standalone: true,
  selector: 'app-cash-flow-listing',
  imports: [GlobalModule, HlmDataTableComponent, CashFlowTreeTrowComponent, CashFlowChartCardComponent],
  templateUrl: './cash-flow-listing.component.html',
})
export class CashFlowListingComponent extends BaseRecordListingComponentDirective<CashFlow, GetAllCashFlowByFilterParams> {
  override facade = inject(CashFlowFacade);
  override queryFacade = inject(CashFlowQueryFacade);
  override columns: WritableSignal<HlmDataTableColumn[]> = signal([]);

  secrecyService = inject(SecrecyService);
  centerOfCostService = inject(CenterOfCostService);
  planOfAccountService = inject(PlanOfAccountService);
  bankAccountService = inject(BankAccountService);

  secrecyOptions: SelectItem<PllID>[] = [];
  centerOfCostOptions: SelectItem<PllID>[] = [];
  planOfAccountOptions: SelectItem<PllID>[] = [];
  bankAccountOptions: SelectItem<PllID>[] = [];

  payableValues = computed(() => this.values().find(cf => cf.type === "PAYABLE_MARK")?.values.map(val => val * -1) || []);
  toPayValues = computed(() => this.values().find(cf => cf.type === "PAYABLE_MARK")?.values.map(val => val * -1? (val * -1 / 2) * 0.3 : 0).reverse() || []);
  receivableValues = computed(() => this.values().find(cf => cf.type === "RECEIVABLE_MARK")?.values  || []);
  rendValues = computed(() => this.values().find(cf => cf.type === "RECEIVABLE_MARK")?.values.map(val => val? (val / 2) * 0.1 : 0)  || []);

  override $evNgOnInit: EventObs<void> = event(switchMap(() => forkJoin({
    a: this.$getSecrecyOptions(),
    b: this.$getCenterOfCostOptions(),
    c: this.$getPlanOfAccountOptions(),
    d: this.$getBankAccountOptions(),
  })));

  override $evUpdateUI: EventObs<PllPaginatedResponse<CashFlow>> = event(tap(response => {
    if(!response.data.length) return;
    const periods = response.data.shift();
    this.queryFacade.data.set(response);
    this.columns.set([
      { header: "", class: "flex-1" },
      ...periods.values.map(period => ({ header: moment(period).format("MMM YY"), class: "w-29 justify-end" })),
    ]);
  }));

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

  onInputSearch(query: string) {
    this.filter.controls.query.setValue(query);
    this.updateUI();
  };

  onDateChange(date?: Date) {
    this.filter.controls.date.setValue(date || new Date());
    this.updateUI();
  };

  handleSetNextRange() {
    this.filter.controls.date.setValue(moment(this.filter.value.date).add(1, "year").toDate());
    this.updateUI();
  };

  handleSetPrevRange() {
    this.filter.controls.date.setValue(moment(this.filter.value.date).subtract(1, "year").toDate());
    this.updateUI();
  };
};