import { Component, inject } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective } from '../../../../../common/directives/base-form-component.directive';
import { CenterOfCost } from '../../../models/center-of-cost.model';
import { CenterOfCostFacade } from '../../../facades/center-of-cost.facade';

@Component({
  standalone: true,
  selector: 'app-center-of-cost-form',
  host: {
		role: 'div',
		'[class]': '_computedClass()',
	},
  imports: [GlobalModule],
  templateUrl: './center-of-cost-form.component.html',
})
export class CenterOfCostFormComponent extends BaseFormComponentDirective<CenterOfCost> {
  override facade = inject(CenterOfCostFacade);
};