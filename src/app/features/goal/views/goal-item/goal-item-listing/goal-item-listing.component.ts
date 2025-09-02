import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { GetAllGoalItemByFilterParams, GetAllGoalItemByFilterResponse } from '../../../services/goal-item.service';
import { GoalItemFacade } from '../../../facades/goal-item.facade';
import { HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';

@Component({
  standalone: true,
  selector: 'app-goal-item-listing',
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: './goal-item-listing.component.html',
})
export class GoalItemListingComponent extends BaseRecordListingComponentDirective<GetAllGoalItemByFilterResponse, GetAllGoalItemByFilterParams> {
  override facade = inject(GoalItemFacade);
  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "Nome", class: "flex-1" },
  ]);
};