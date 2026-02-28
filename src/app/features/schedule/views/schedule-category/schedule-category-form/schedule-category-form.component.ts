import { Component, inject } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective } from '../../../../../common/directives/base-form-component.directive';
import { ScheduleCategory } from '../../../models/schedule-category.model';
import { ScheduleCategoryFacade } from '../../../facades/schedule-category.facade';
import { Colors, colors } from '../../../../../common/types/colors.type';

@Component({
  standalone: true,
  selector: 'app-schedule-category-form',
  host: {
		role: 'div',
		'[class]': '_computedClass()',
	},
  imports: [GlobalModule],
  templateUrl: './schedule-category-form.component.html',
})
export class ScheduleCategoryFormComponent extends BaseFormComponentDirective<ScheduleCategory> {
  override facade = inject(ScheduleCategoryFacade);
  
  colors = Object.entries(colors).map(([key, value]) => ({ key: key as Colors, value }));

  onChangeColor(color: Colors) {
    this.form.controls.color.setValue(color);
  };
};