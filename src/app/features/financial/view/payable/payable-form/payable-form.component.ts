
import { Component, inject } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective } from '../../../../../common/directives/base-form-component.directive';
import { Payable } from '../../../models/payable.model';
import { PayableFacade } from '../../../facades/payable.facade';

@Component({
  selector: 'app-payable-form',
  imports: [GlobalModule],
  templateUrl: './payable-form.component.html',
})
export class PayableFormComponent extends BaseFormComponentDirective<Payable> {
  override facade: PayableFacade = inject(PayableFacade);
};
