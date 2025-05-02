import { Component, inject } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective } from '../../../../../common/directives/base-form-component.directive';
import { CenterOfCost } from '../../../models/center-of-cost.model';
import { CenterOfCostFacade } from '../../../facades/center-of-cost.facade';

@Component({
  selector: 'app-center-of-cost-form',
  imports: [GlobalModule],
  templateUrl: './center-of-cost-form.component.html',
})
export class CenterOfCostFormComponent extends BaseFormComponentDirective<CenterOfCost> {
  override facade: CenterOfCostFacade = inject(CenterOfCostFacade);
};