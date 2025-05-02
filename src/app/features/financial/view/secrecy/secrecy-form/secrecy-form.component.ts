import { Component, inject } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective } from '../../../../../common/directives/base-form-component.directive';
import { Secrecy } from '../../../models/secrecy.model';
import { SecrecyFacade } from '../../../facades/secrecy.facade';

@Component({
  selector: 'app-secrecy-form',
  imports: [GlobalModule],
  templateUrl: './secrecy-form.component.html',
})
export class SecrecyFormComponent extends BaseFormComponentDirective<Secrecy> {
  override facade: SecrecyFacade = inject(SecrecyFacade);
};