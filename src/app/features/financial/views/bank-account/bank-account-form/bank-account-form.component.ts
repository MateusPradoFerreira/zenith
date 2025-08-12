import { Component, inject } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective } from '../../../../../common/directives/base-form-component.directive';
import { BankAccount } from '../../../models/bank-account.model';
import { BankAccountFacade } from '../../../facades/bank-account.facade';

@Component({
  standalone: true,
  selector: 'app-bank-account-form',
  imports: [GlobalModule],
  templateUrl: './bank-account-form.component.html',
})
export class BankAccountFormComponent extends BaseFormComponentDirective<BankAccount> {
  override facade = inject(BankAccountFacade);
};