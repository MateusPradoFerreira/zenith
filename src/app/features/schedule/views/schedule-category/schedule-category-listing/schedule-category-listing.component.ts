import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { ScheduleCategoryFacade, ScheduleCategoryQueryFacade, ScheduleCategoryUQP, ScheduleCategoryUQR } from '../../../facades/schedule-category.facade';
import { HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import { ScheduleCategoryFormComponent } from '../schedule-category-form/schedule-category-form.component';

@Component({
  standalone: true,
  selector: 'app-schedule-category-listing',
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: './schedule-category-listing.component.html',
})
export class ScheduleCategoryListingComponent extends BaseRecordListingComponentDirective<ScheduleCategoryUQR, ScheduleCategoryUQP, ScheduleCategoryFormComponent> {
  override facade = inject(ScheduleCategoryFacade);
  override queryFacade = inject(ScheduleCategoryQueryFacade);

  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "Nome", class: "flex-1" },
  ]);

  statusOptions = [
    { label: "Todos", value: "ALL" },
    { label: "Ativos", value: "ACTIVE" },
    { label: "Inativos", value: "INACTIVE" },
  ];
};