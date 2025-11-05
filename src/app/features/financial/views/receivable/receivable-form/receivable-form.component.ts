import { Component, inject, input } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective, event, EventObs } from '../../../../../common/directives/base-form-component.directive';
import { Receivable } from '../../../models/receivable.model';
import { ReceivableFacade } from '../../../facades/receivable.facade';
import { forkJoin, switchMap, tap } from 'rxjs';
import { SecrecyService } from '../../../services/secrecy.service';
import { CenterOfCostService } from '../../../services/center-of-cost.service';
import { PlanOfAccountService } from '../../../services/plan-of-account.service';
import { BankAccountService } from '../../../services/bank-account.service';
import { SelectItem } from '../../../../../common/types/select-item.type';
import { PllID } from '@pollaris';

@Component({
  standalone: true,
  selector: 'app-receivable-form',
  imports: [GlobalModule],
  templateUrl: './receivable-form.component.html',
})
export class ReceivableFormComponent extends BaseFormComponentDirective<Receivable> {
  name = input<string>();
  
  override facade = inject(ReceivableFacade);

  secrecyService = inject(SecrecyService);
  centerOfCostService = inject(CenterOfCostService);
  planOfAccountService = inject(PlanOfAccountService);
  bankAccountService = inject(BankAccountService);

  secrecyOptions: SelectItem<PllID>[] = [];
  centerOfCostOptions: SelectItem<PllID>[] = [];
  planOfAccountOptions: SelectItem<PllID>[] = [];
  bankAccountOptions: SelectItem<PllID>[] = [];

  override $evNgOnInit: EventObs<void> = event(switchMap(() => forkJoin({
    a: this.$getSecrecyOptions(),
    b: this.$getCenterOfCostOptions(),
    c: this.$getPlanOfAccountOptions(),
    d: this.$getBankAccountOptions(),
  })));

  override $evInitCreateRecord: EventObs<void> = event(tap(() => {
    if(this.name()) this.form.controls.name.setValue(this.name());
    if(this.secrecyOptions.length) this.form.controls.secrecyId.setValue(this.secrecyOptions[0].value);
    if(this.centerOfCostOptions.length) this.form.controls.centerOfCostId.setValue(this.centerOfCostOptions[0].value);
    if(this.planOfAccountOptions.length) this.form.controls.planOfAccountId.setValue(this.planOfAccountOptions[0].value);
    if(this.bankAccountOptions.length) this.form.controls.bankAccountId.setValue(this.bankAccountOptions[0].value);
  }));

  $getSecrecyOptions = () => this.secrecyService.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => {
    this.secrecyOptions = response.data.map(record => ({ label: record.name, value: record.id }));
  }));

  $getCenterOfCostOptions = () => this.centerOfCostService.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => {
    this.centerOfCostOptions = response.data.map(record => ({ label: record.name, value: record.id }));
  }));

  $getPlanOfAccountOptions = () => this.planOfAccountService.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => {
    this.planOfAccountOptions = response.data.map(record => ({ label: record.name, value: record.id }));
  }));

  $getBankAccountOptions = () => this.bankAccountService.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => {
    this.bankAccountOptions = response.data.map(record => ({ label: record.name, value: record.id }));
  }));

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
    this.processing.set(true),
    this.facade.handleReopen(this.id()).subscribe({
      next: () => this.updateUI(),
      error: error => console.error(error),
      complete: () => this.processing.set(false),
    });
  };
};