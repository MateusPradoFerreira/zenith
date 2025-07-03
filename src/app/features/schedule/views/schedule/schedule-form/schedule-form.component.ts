import { Component, inject } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective } from '../../../../../common/directives/base-form-component.directive';
import { Schedule } from '../../../models/schedule.model';
import { ScheduleFacade } from '../../../facades/schedule.facade';

@Component({
  standalone: true,
  selector: 'app-schedule-form',
  imports: [GlobalModule],
  templateUrl: './schedule-form.component.html',
})
export class ScheduleFormComponent extends BaseFormComponentDirective<Schedule> {
  override facade = inject(ScheduleFacade);
};