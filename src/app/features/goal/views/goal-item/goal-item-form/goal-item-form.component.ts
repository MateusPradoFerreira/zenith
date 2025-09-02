import { Component, inject } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective } from '../../../../../common/directives/base-form-component.directive';
import { GoalItem } from '../../../models/goal-item.model';
import { GoalItemFacade } from '../../../facades/goal-item.facade';

@Component({
  standalone: true,
  selector: 'app-goal-item-form',
  imports: [GlobalModule],
  templateUrl: './goal-item-form.component.html',
})
export class GoalItemFormComponent extends BaseFormComponentDirective<GoalItem> {
  override facade = inject(GoalItemFacade);
};