import { Component, inject, signal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective } from '../../../../../common/directives/base-form-component.directive';
import { Recurrence } from '../../../models/recurrence.model';
import { RecurrenceFacade } from '../../../facades/recurrence.facade';
import { ClassValue } from 'clsx';

@Component({
  standalone: true,
  selector: 'app-recurrence-form',
  imports: [GlobalModule],
  templateUrl: './recurrence-form.component.html',
})
export class RecurrenceFormComponent extends BaseFormComponentDirective<Recurrence> {
  override readonly baseUserClass = signal<ClassValue>("grid grid-cols-12 gap-3.5 gap-x-2");
  override facade = inject(RecurrenceFacade);
};