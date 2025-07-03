import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { CenterOfCost } from '../../../models/center-of-cost.model';
import { GetAllCenterOfCostByFilterParams } from '../../../services/center-of-cost.service';
import { CenterOfCostFacade } from '../../../facades/center-of-cost.facade';
import { HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';

@Component({
  standalone: true,
  selector: 'app-center-of-cost-listing',
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: './center-of-cost-listing.component.html',
})
export class CenterOfCostListingComponent extends BaseRecordListingComponentDirective<CenterOfCost, GetAllCenterOfCostByFilterParams> {
  override facade = inject(CenterOfCostFacade);
  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "Nome", class: "flex-1" },
  ]);

  statusOptions = [
    { label: "Todos", value: "ALL" },
    { label: "Ativos", value: "ACTIVE" },
    { label: "Inativos", value: "INACTIVE" },
  ];
};