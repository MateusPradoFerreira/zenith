import { Component, inject } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { Schedule } from '../../../models/schedule.model';
import { GetAllScheduleByFilterParams } from '../../../services/schedule.service';
import { ScheduleFacade } from '../../../facades/schedule.facade';
import { HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';

@Component({
  standalone: true,
  selector: 'app-schedule-listing',
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: './schedule-listing.component.html',
})
export class ScheduleListingComponent extends BaseRecordListingComponentDirective<Schedule, GetAllScheduleByFilterParams> {
  override facade = inject(ScheduleFacade);
};