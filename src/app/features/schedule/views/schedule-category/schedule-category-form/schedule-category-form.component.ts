import { Component, inject } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective } from '../../../../../common/directives/base-form-component.directive';
import { ScheduleCategory } from '../../../models/schedule-category.model';
import { ScheduleCategoryFacade } from '../../../facades/schedule-category.facade';

@Component({
  standalone: true,
  selector: 'app-schedule-category-form',
  imports: [GlobalModule],
  templateUrl: './schedule-category-form.component.html',
})
export class ScheduleCategoryFormComponent extends BaseFormComponentDirective<ScheduleCategory> {
  override facade = inject(ScheduleCategoryFacade);
};