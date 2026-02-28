import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { CenterOfCostFacade, CenterOfCostQueryFacade, CenterOfCostUQP, CenterOfCostUQR } from '../../../facades/center-of-cost.facade';
import { HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import { CenterOfCostFormComponent } from '../center-of-cost-form/center-of-cost-form.component';
import { SelectItem } from '../../../../../common/types/select-item.type';

@Component({
  standalone: true,
  selector: 'app-center-of-cost-listing',
  host: {
		role: 'div',
		'[class]': '_computedClass()',
	},
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: './center-of-cost-listing.component.html',
})
export class CenterOfCostListingComponent extends BaseRecordListingComponentDirective<CenterOfCostUQR, CenterOfCostUQP, CenterOfCostFormComponent> {
  override facade = inject(CenterOfCostFacade);
  override queryFacade = inject(CenterOfCostQueryFacade);
  
  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "Nome", class: "flex-1" },
  ]);

  statusOptions: SelectItem<"ALL" | "ACTIVE" | "INACTIVE">[] = [
    { label: "Todos", value: "ALL" },
    { label: "Ativo", value: "ACTIVE" },
    { label: "Inativo", value: "INACTIVE" },
  ];
};