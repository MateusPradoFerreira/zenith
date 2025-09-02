import { Component, inject } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective } from '../../../../../common/directives/base-form-component.directive';
import { GoalTask } from '../../../models/goal-task.model';
import { GoalTaskFacade } from '../../../facades/goal-task.facade';

@Component({
  standalone: true,
  selector: 'app-goal-task-form',
  imports: [GlobalModule],
  templateUrl: './goal-task-form.component.html',
})
export class GoalTaskFormComponent extends BaseFormComponentDirective<GoalTask> {
  override facade = inject(GoalTaskFacade);
};