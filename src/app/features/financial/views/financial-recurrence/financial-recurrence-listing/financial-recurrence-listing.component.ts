import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { FinancialRecurrenceFacade, FinancialRecurrenceQueryFacade, FinancialRecurrenceUseQueryParams, FinancialRecurrenceUseQueryResponse } from '../../../facades/financial-recurrence.facade';
import { HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import { FinancialRecurrenceFormComponent } from '../financial-recurrence-form/financial-recurrence-form.component';
import { SelectItem } from '../../../../../common/types/select-item.type';

@Component({
  standalone: true,
  selector: 'app-financial-recurrence-listing',
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: './financial-recurrence-listing.component.html',
})
export class FinancialRecurrenceListingComponent extends BaseRecordListingComponentDirective<FinancialRecurrenceUseQueryResponse, FinancialRecurrenceUseQueryParams, FinancialRecurrenceFormComponent> {
  override facade = inject(FinancialRecurrenceFacade);
  override queryFacade = inject(FinancialRecurrenceQueryFacade);
  
  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "Nome", class: "flex-1" },
  ]);

  statusOptions: SelectItem<"ALL" | "ACTIVE" | "INACTIVE">[] = [
    { label: "Todos", value: "ALL" },
    { label: "Ativo", value: "ACTIVE" },
    { label: "Inativo", value: "INACTIVE" },
  ];
};