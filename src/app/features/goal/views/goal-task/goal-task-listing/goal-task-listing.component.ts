import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { GetAllGoalTaskByFilterParams, GetAllGoalTaskByFilterResponse } from '../../../services/goal-task.service';
import { GoalTaskFacade } from '../../../facades/goal-task.facade';
import { HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';

@Component({
  standalone: true,
  selector: 'app-goal-task-listing',
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: './goal-task-listing.component.html',
})
export class GoalTaskListingComponent extends BaseRecordListingComponentDirective<GetAllGoalTaskByFilterResponse, GetAllGoalTaskByFilterParams> {
  override facade = inject(GoalTaskFacade);
  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "Nome", class: "flex-1" },
  ]);
};