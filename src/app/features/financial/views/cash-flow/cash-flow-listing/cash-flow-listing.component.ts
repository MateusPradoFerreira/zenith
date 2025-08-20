import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { CashFlow } from '../../../models/cash-flow.model';
import { GetAllCashFlowByFilterParams } from '../../../services/cash-flow.service';
import { CashFlowFacade } from '../../../facades/cash-flow.facade';
import { HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import { event, EventObs } from '../../../../../common/directives/base-form-component.directive';
import { tap } from 'rxjs';
import moment from 'moment';
import { PllPaginatedResponse } from '@pollaris';
import { CashFlowTreeTrowComponent } from '../../../components/cash-flow-tree-trow.component';

@Component({
  standalone: true,
  selector: 'app-cash-flow-listing',
  imports: [GlobalModule, HlmDataTableComponent, CashFlowTreeTrowComponent],
  templateUrl: './cash-flow-listing.component.html',
})
export class CashFlowListingComponent extends BaseRecordListingComponentDirective<CashFlow, GetAllCashFlowByFilterParams> {
  override facade = inject(CashFlowFacade);
  override columns: WritableSignal<HlmDataTableColumn[]> = signal([]);

  override onUpdateUI: EventObs<PllPaginatedResponse<CashFlow>> = event(tap(response => {
    const periods = response.data.shift();
    this.facade.data.set(response);
    this.columns.set([
      { header: "", class: "flex-1" },
      ...periods.values.map(period => ({ header: moment(period).format("MMM YY"), class: "w-29 justify-end" })),
    ]);
  }));

  onInputSearch(query: string) {
    this.filter.controls.query.setValue(query);
    this.updateUI();
  };
};