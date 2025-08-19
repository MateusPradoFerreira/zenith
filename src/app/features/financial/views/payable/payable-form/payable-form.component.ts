import { Component, inject, input } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective, event, EventObs } from '../../../../../common/directives/base-form-component.directive';
import { Payable } from '../../../models/payable.model';
import { PayableFacade, PayableStatusOptions } from '../../../facades/payable.facade';
import { forkJoin, switchMap, tap } from 'rxjs';
import { CenterOfCostFacade } from '../../../facades/center-of-cost.facade';
import { PlanOfAccountFacade } from '../../../facades/plan-of-account.facade';
import { SecrecyFacade } from '../../../facades/secrecy.facade';
import { Secrecy } from '../../../models/secrecy.model';
import { CenterOfCost } from '../../../models/center-of-cost.model';
import { PlanOfAccount } from '../../../models/plan-of-account.model';
import { BankAccount } from '../../../models/bank-account.model';
import { BankAccountFacade } from '../../../facades/bank-account.facade';

@Component({
  standalone: true,
  selector: 'app-payable-form',
  imports: [GlobalModule],
  templateUrl: './payable-form.component.html',
})
export class PayableFormComponent extends BaseFormComponentDirective<Payable> {
  name = input<string>();
  
  override facade = inject(PayableFacade);

  secrecyFacade = inject(SecrecyFacade);
  centerOfCostFacade = inject(CenterOfCostFacade);
  planOfAccountFacade = inject(PlanOfAccountFacade);
  bankAccountFacade = inject(BankAccountFacade);

  statusOptions = PayableStatusOptions;
  secrecyOptions: Secrecy[] = [];
  centerOfCostOptions: CenterOfCost[] = [];
  planOfAccountOptions: PlanOfAccount[] = [];
  bankAccountOptions: BankAccount[] = [];

  override onNgOnInit = event(switchMap(() => forkJoin({
    handleGetSecrecyOptions: this.handleGetSecrecyOptions(),
    handleGetCenterOfCostOptions: this.handleGetCenterOfCostOptions(),
    handleGetPlanOfAccountOptions: this.handleGetPlanOfAccountOptions(),
    handleGetBankAccountOptions: this.handleGetBankAccountOptions(),
  })));

  override onInitCreateRecord = event(tap(() => {
    if(this.name()) this.form.controls.name.setValue(this.name());
    if(this.secrecyOptions.length) this.form.controls.secrecyId.setValue(this.secrecyOptions[0].id);
    if(this.centerOfCostOptions.length) this.form.controls.centerOfCostId.setValue(this.centerOfCostOptions[0].id);
    if(this.planOfAccountOptions.length) this.form.controls.planOfAccountId.setValue(this.planOfAccountOptions[0].id);
    if(this.bankAccountOptions.length) this.form.controls.bankAccountId.setValue(this.bankAccountOptions[0].id);
  }));

  handleGetSecrecyOptions = () => this.secrecyFacade.service.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => this.secrecyOptions = response.data));
  handleGetCenterOfCostOptions = () => this.centerOfCostFacade.service.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => this.centerOfCostOptions = response.data));
  handleGetPlanOfAccountOptions = () => this.planOfAccountFacade.service.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => this.planOfAccountOptions = response.data));
  handleGetBankAccountOptions = () => this.bankAccountFacade.service.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => this.bankAccountOptions = response.data));

  formatSequence(number: number): string {
    return number.toString().padStart(4, '0');
  };

  pay() {
    this.processing.set(true);
    this.facade.handlePay(this.id()).subscribe({
      next: () => this.updateUI(),
      error: error => console.error(error),
      complete: () => this.processing.set(false),
    });
  };

  reopen() {
    this.processing.set(false),
    this.facade.handleReopen(this.id()).subscribe({
      next: () => this.updateUI(),
      error: error => console.error(error),
      complete: () => this.processing.set(false),
    });
  };
};