import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { PlanOfAccount } from '../../../models/plan-of-account.model';
import { GetAllPlanOfAccountByFilterParams } from '../../../services/plan-of-account.service';
import { PlanOfAccountFacade } from '../../../facades/plan-of-account.facade';
import { HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';

@Component({
  standalone: true,
  selector: 'app-plan-of-account-listing',
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: './plan-of-account-listing.component.html',
})
export class PlanOfAccountListingComponent extends BaseRecordListingComponentDirective<PlanOfAccount, GetAllPlanOfAccountByFilterParams> {
  override facade = inject(PlanOfAccountFacade);
  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "Nome", class: "flex-1" },
  ]);

  statusOptions = [
    { label: "Todos", value: "ALL" },
    { label: "Ativos", value: "ACTIVE" },
    { label: "Inativos", value: "INACTIVE" },
  ];
};