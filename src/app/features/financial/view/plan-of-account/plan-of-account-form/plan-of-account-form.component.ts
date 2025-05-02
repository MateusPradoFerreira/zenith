import { Component, inject } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective } from '../../../../../common/directives/base-form-component.directive';
import { PlanOfAccount } from '../../../models/plan-of-account.model';
import { PlanOfAccountFacade } from '../../../facades/plan-of-account.facade';

@Component({
  selector: 'app-plan-of-account-form',
  imports: [GlobalModule],
  templateUrl: './plan-of-account-form.component.html',
})
export class PlanOfAccountFormComponent extends BaseFormComponentDirective<PlanOfAccount> {
  override facade: PlanOfAccountFacade = inject(PlanOfAccountFacade);
};