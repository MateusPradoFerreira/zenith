import { Component, inject, ViewChild } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective, event, EventObs } from '../../../../../common/directives/base-form-component.directive';
import { FinancialRecurrence, FinancialRecurrenceType } from '../../../models/financial-recurrence.model';
import { FinancialRecurrenceFacade } from '../../../facades/financial-recurrence.facade';
import { tap } from 'rxjs';
import { RecurrenceFormComponent } from '../../../../schedule/views/recurrence/recurrence-form/recurrence-form.component';
import { SelectItem } from '../../../../../common/types/select-item.type';

@Component({
  standalone: true,
  selector: 'app-financial-recurrence-form',
  imports: [GlobalModule, RecurrenceFormComponent],
  templateUrl: './financial-recurrence-form.component.html',
})
export class FinancialRecurrenceFormComponent extends BaseFormComponentDirective<FinancialRecurrence> {
  override facade = inject(FinancialRecurrenceFacade);

  typeOptions: SelectItem<FinancialRecurrenceType>[] = [
    { label: "Despesa", value: "PAYABLE" },
    { label: "Receita", value: "RECEIVABLE" },
  ];

  @ViewChild(RecurrenceFormComponent) recurrenceFormComponent: RecurrenceFormComponent;

  override $evNextSumit: EventObs<FinancialRecurrence> = event(tap(() => {
    if(this.recurrenceFormComponent) this.recurrenceFormComponent.updateUI();
  }));
};