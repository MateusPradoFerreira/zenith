import { Component, inject } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective } from '../../../../../common/directives/base-form-component.directive';
import { Goal } from '../../../models/goal.model';
import { GoalFacade } from '../../../facades/goal.facade';

@Component({
  standalone: true,
  selector: 'app-goal-form',
  imports: [GlobalModule],
  templateUrl: './goal-form.component.html',
})
export class GoalFormComponent extends BaseFormComponentDirective<Goal> {
  override facade = inject(GoalFacade);
};