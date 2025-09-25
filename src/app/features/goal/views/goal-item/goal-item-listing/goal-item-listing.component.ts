import { Component, computed, inject, input, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { GetAllGoalItemByFilterParams, GetAllGoalItemByFilterResponse } from '../../../services/goal-item.service';
import { GoalItemFacade } from '../../../facades/goal-item.facade';
import { HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import { event, EventObs } from '../../../../../common/directives/base-form-component.directive';
import { tap } from 'rxjs';
import { PllID } from '@pollaris';
import moment from 'moment';

@Component({
  standalone: true,
  selector: 'app-goal-item-listing',
  imports: [GlobalModule, HlmDataTableComponent],
  providers: [GoalItemFacade],
  templateUrl: './goal-item-listing.component.html',
})
export class GoalItemListingComponent extends BaseRecordListingComponentDirective<GetAllGoalItemByFilterResponse, GetAllGoalItemByFilterParams> {
  goalId = input.required<PllID>();

  override facade = inject(GoalItemFacade);
  override columns: WritableSignal<HlmDataTableColumn[]> = signal([]);

  groupedValues = computed<{ date: Date, values: GetAllGoalItemByFilterResponse[] }[]>(() => {
    const groups: Record<string, GetAllGoalItemByFilterResponse[]> = {};
    for (const item of this.values()) {
      const day = moment(item.startsAt).startOf("day").format("YYYY-MM-DD");
      if (!groups[day]) groups[day] = [];
      groups[day].push(item);
    };

    return Object.entries(groups).map(([day, schedules]) => ({
      date: moment(day, "YYYY-MM-DD").toDate(),
      values: schedules,
    }));
  });

  override onNgOnInit: EventObs<void> = event(tap(() => {
    this.filter.controls.goalId.setValue(this.goalId());
  }));

  getEndsAtTime(rowData: GetAllGoalItemByFilterResponse) {
    return moment(rowData.startsAt).add(rowData.duration, "minutes").toDate();
  };
};