import { Component, inject, ViewChild } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective, event, EventObs } from '../../../../../common/directives/base-form-component.directive';
import { FinancialRecurrence, FinancialRecurrenceType } from '../../../models/financial-recurrence.model';
import { FinancialRecurrenceFacade } from '../../../facades/financial-recurrence.facade';
import { forkJoin, switchMap, tap } from 'rxjs';
import { RecurrenceFormComponent } from '../../../../schedule/views/recurrence/recurrence-form/recurrence-form.component';
import { SelectItem } from '../../../../../common/types/select-item.type';
import { errorHandler, nextErrorHandler } from '../../../../../common/operators/error-handler.operator';
import { PllID } from '@pollaris';
import { SecrecyService } from '../../../services/secrecy.service';
import { CenterOfCostService } from '../../../services/center-of-cost.service';
import { PlanOfAccountService } from '../../../services/plan-of-account.service';
import { BankAccountService } from '../../../services/bank-account.service';
import { RecurrenceFacade } from '../../../../schedule/facades/recurrence.facade';
import { toast } from 'ngx-sonner';

@Component({
  standalone: true,
  selector: 'app-financial-recurrence-form',
  host: {
		role: 'div',
		'[class]': '_computedClass()',
	},
  imports: [GlobalModule, RecurrenceFormComponent],
  templateUrl: './financial-recurrence-form.component.html',
})
export class FinancialRecurrenceFormComponent extends BaseFormComponentDirective<FinancialRecurrence> {
  override facade = inject(FinancialRecurrenceFacade);

  private recurrenceFacade = inject(RecurrenceFacade);
  
  secrecyService = inject(SecrecyService);
  centerOfCostService = inject(CenterOfCostService);
  planOfAccountService = inject(PlanOfAccountService);
  bankAccountService = inject(BankAccountService);

  secrecyOptions: SelectItem<PllID>[] = [];
  centerOfCostOptions: SelectItem<PllID>[] = [];
  planOfAccountOptions: SelectItem<PllID>[] = [];
  bankAccountOptions: SelectItem<PllID>[] = [];

  typeOptions: SelectItem<FinancialRecurrenceType>[] = [
    { label: "Despesa", value: "PAYABLE" },
    { label: "Receita", value: "RECEIVABLE" },
  ];

  @ViewChild(RecurrenceFormComponent) recurrenceFormComponent: RecurrenceFormComponent;
  
  override $evNgOnInit: EventObs<void> = event(switchMap(() => forkJoin({
    a: this.$getSecrecyOptions(),
    b: this.$getCenterOfCostOptions(),
    c: this.$getPlanOfAccountOptions(),
    d: this.$getBankAccountOptions(),
  })));

  override $evNextSumit: EventObs<FinancialRecurrence> = event(tap(() => {
    if(this.recurrenceFormComponent) this.recurrenceFormComponent.updateUI();
  }));

  override $evInitCreateRecord: EventObs<void> = event(tap(() => {
    if(this.secrecyOptions.length) this.form.controls.secrecyId.setValue(this.secrecyOptions[0].value);
    if(this.centerOfCostOptions.length) this.form.controls.centerOfCostId.setValue(this.centerOfCostOptions[0].value);
    if(this.planOfAccountOptions.length) this.form.controls.planOfAccountId.setValue(this.planOfAccountOptions[0].value);
    if(this.bankAccountOptions.length) this.form.controls.bankAccountId.setValue(this.bankAccountOptions[0].value);
  }));

  $getSecrecyOptions = () => this.secrecyService.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => {
    this.secrecyOptions = response.data.map(record => ({ label: record.name, value: record.id }));
  }), nextErrorHandler({}));

  $getCenterOfCostOptions = () => this.centerOfCostService.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => {
    this.centerOfCostOptions = response.data.map(record => ({ label: record.name, value: record.id }));
  }), nextErrorHandler({}));

  $getPlanOfAccountOptions = () => this.planOfAccountService.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => {
    this.planOfAccountOptions = response.data.map(record => ({ label: record.name, value: record.id }));
  }), nextErrorHandler({}));

  $getBankAccountOptions = () => this.bankAccountService.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => {
    this.bankAccountOptions = response.data.map(record => ({ label: record.name, value: record.id }));
  }), nextErrorHandler({}));
  
  generate() {
    this.processing.set(false),
    this.recurrenceFacade.handleGenerate(this.form.value.recurrenceId).pipe(errorHandler()).subscribe({
      next: () => {
        toast.success("SUCESSO!", { description: "Registros gerados com sucesso!" });
        this.updateUI()
        this.processing.set(false);
      },
      error: () => {
        this.processing.set(false);
      },
    });
  };
};