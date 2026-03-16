import { Component, inject, input, signal, ViewChild } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective, event, EventObs } from '../../../../../common/directives/base-form-component.directive';
import { Schedule, ScheduleFrequency } from '../../../models/schedule.model';
import { ScheduleFacade } from '../../../facades/schedule.facade';
import { switchMap, tap } from 'rxjs';
import { ScheduleCategoryFacade } from '../../../facades/schedule-category.facade';
import { ScheduleCategory } from '../../../models/schedule-category.model';
import { SelectItem } from '../../../../../common/types/select-item.type';
import moment from 'moment';
import { Colors, colors } from '../../../../../common/types/colors.type';
import { RecurrenceFormComponent } from '../../recurrence/recurrence-form/recurrence-form.component';
import { RecurrenceWeekdayOptions } from '../../../facades/recurrence.facade';

@Component({
  standalone: true,
  selector: 'app-schedule-form',
  host: {
		role: 'div',
		'[class]': '_computedClass()',
	},
  imports: [GlobalModule, RecurrenceFormComponent],
  templateUrl: './schedule-form.component.html',
})
export class ScheduleFormComponent extends BaseFormComponentDirective<Schedule> {
  date = input<Date>();
  setDateHour = input<boolean>();
  title = input<string>();

  override facade = inject(ScheduleFacade);

  scheduleCategoryFacade = inject(ScheduleCategoryFacade);

  scheduleCategoryOptions: ScheduleCategory[] = [];
  frequencyOptions: SelectItem<ScheduleFrequency>[] = [];
  colors = Object.entries(colors).map(([key, value]) => ({ key: key as Colors, value }));

  @ViewChild(RecurrenceFormComponent) recurrenceFormComponent: RecurrenceFormComponent;
  
  override $evNgOnInit = event(
    switchMap(() => this.$getScheduleCategoryOptions()),
  );

  override $evInitRecord = event(tap(() => this.setFrequencyOptions()));

  override $evNextSumit: EventObs<Schedule, any> = event(tap(() => {
    if(this.recurrenceFormComponent) this.recurrenceFormComponent.updateUI();
  }));

  override $evInitCreateRecord = event(tap(() => {
    if(this.title()) this.form.controls.title.setValue(this.title());
    if(this.date()) {
      this.form.controls.startsAt.setValue(this.date());
      this.form.controls.endsAt.setValue(this.date());
      if(this.setDateHour()) {
        this.form.controls.startsAtTime.setValue(moment(this.date()).format("HH:mm"));
        this.form.controls.endsAtTime.setValue(moment(this.date()).add(30, "minutes").format("HH:mm"));
      };
    };
    if(this.scheduleCategoryOptions.length) this.form.controls.categoryId.setValue(this.scheduleCategoryOptions[0].id);
  }));

  $getScheduleCategoryOptions = () => this.scheduleCategoryFacade.service.getAllByFilter({ status: "ACTIVE", type: "SCHEDULE" }).pipe(tap(response => this.scheduleCategoryOptions = response.data));

  setFrequencyOptions() {
    const date = moment(this.form.value.startsAt);
    this.frequencyOptions = [
      { label: "Não se repete", value: "NO_REPETITION" },
      { label: "Diariamente", value: "DAILY" },
      { label: `Semanal: cada ${RecurrenceWeekdayOptions[!date.day()? 6 : date.day() - 1]?.label.toLowerCase() || "Segunda-Feira"}`, value: "WEEKLY" },
      { label: "Mensalmente", value: "MONTHLY" },
      { label: `Anual em ${date.format("MMMM DD")}`, value: "YEARLY" },
      { label: "Personalizar", value: "CUSTOM" },
    ];
  };

  delete() {
    this.processing.set(true);
    this.facade.openToDelete(this.form.value.id).subscribe({
      next: () => {
        this._context.close(this.crrRecord);
        this.processing.set(false);
      },
      error: () => {
        this.processing.set(false);
      }
    });
  };
};