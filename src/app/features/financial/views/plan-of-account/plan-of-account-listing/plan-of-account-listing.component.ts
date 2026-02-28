import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { PlanOfAccountFacade, PlanOfAccountQueryFacade, PlanOfAccountUQP, PlanOfAccountUQR } from '../../../facades/plan-of-account.facade';
import { HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import { PlanOfAccountFormComponent } from '../plan-of-account-form/plan-of-account-form.component';
import { SelectItem } from '../../../../../common/types/select-item.type';

@Component({
  standalone: true,
  selector: 'app-plan-of-account-listing',
  host: {
		role: 'div',
		'[class]': '_computedClass()',
	},
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: './plan-of-account-listing.component.html',
})
export class PlanOfAccountListingComponent extends BaseRecordListingComponentDirective<PlanOfAccountUQR, PlanOfAccountUQP, PlanOfAccountFormComponent> {
  override facade = inject(PlanOfAccountFacade);
  override queryFacade = inject(PlanOfAccountQueryFacade);
  
  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "Nome", class: "flex-1" },
  ]);

  statusOptions: SelectItem<"ALL" | "ACTIVE" | "INACTIVE">[] = [
    { label: "Todos", value: "ALL" },
    { label: "Ativo", value: "ACTIVE" },
    { label: "Inativo", value: "INACTIVE" },
  ];
};