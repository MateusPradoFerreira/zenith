import { Component, inject, signal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective, event, EventObs } from '../../../../../common/directives/base-form-component.directive';
import { Recurrence, RecurrenceWeekday } from '../../../models/recurrence.model';
import { RecurrenceFacade, RecurrenceFrequencyOptions, RecurrenceShortWeekdayOptions } from '../../../facades/recurrence.facade';
import { ClassValue } from 'clsx';
import { tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-recurrence-form',
  imports: [GlobalModule],
  templateUrl: './recurrence-form.component.html',
})
export class RecurrenceFormComponent extends BaseFormComponentDirective<Recurrence> {
  override readonly baseUserClass = signal<ClassValue>("grid grid-cols-12 gap-3.5 gap-x-2");
  override facade = inject(RecurrenceFacade);
  
  override $evNgOnInit: EventObs<void, any> = event(tap(() => {
    console.log(this.form.controls)
  }));

  shortWeekdayOptions = RecurrenceShortWeekdayOptions;
  frequencyOptions = RecurrenceFrequencyOptions;

  onChangeWeekday(weekday: RecurrenceWeekday) {
    let weekdays = this.form.value.byWeekday;
    if(weekdays.includes(weekday)) {
      weekdays = weekdays.filter(val => val !== weekday);
    } else weekdays.push(weekday);
    this.form.controls.byWeekday.setValue(weekdays);
  };
};