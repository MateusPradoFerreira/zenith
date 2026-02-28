import { Component, inject } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective } from '../../../../../common/directives/base-form-component.directive';
import { Secrecy } from '../../../models/secrecy.model';
import { SecrecyFacade } from '../../../facades/secrecy.facade';

@Component({
  standalone: true,
  selector: 'app-secrecy-form',
  host: {
		role: 'div',
		'[class]': '_computedClass()',
	},
  imports: [GlobalModule],
  templateUrl: './secrecy-form.component.html',
})
export class SecrecyFormComponent extends BaseFormComponentDirective<Secrecy> {
  override facade = inject(SecrecyFacade);
};