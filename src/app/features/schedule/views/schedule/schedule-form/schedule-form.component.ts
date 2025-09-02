import { Component, inject, input } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective, event } from '../../../../../common/directives/base-form-component.directive';
import { Schedule } from '../../../models/schedule.model';
import { ScheduleFacade } from '../../../facades/schedule.facade';
import { switchMap, tap } from 'rxjs';
import { ScheduleCategoryFacade } from '../../../facades/schedule-category.facade';
import { ScheduleCategory } from '../../../models/schedule-category.model';

@Component({
  standalone: true,
  selector: 'app-schedule-form',
  imports: [GlobalModule],
  templateUrl: './schedule-form.component.html',
})
export class ScheduleFormComponent extends BaseFormComponentDirective<Schedule> {
  date = input<Date>();
  title = input<string>();

  override facade = inject(ScheduleFacade);

  scheduleCategoryFacade = inject(ScheduleCategoryFacade);

  scheduleCategoryOptions: ScheduleCategory[] = [];
  
  override onNgOnInit = event(
    switchMap(() => this.handleGetScheduleCategoryOptions()),
  );

  override onInitCreateRecord = event(tap(() => {
    if(this.title()) this.form.controls.title.setValue(this.title());
    if(this.date()) {
      this.form.controls.startsAt.setValue(this.date());
      this.form.controls.endsAt.setValue(this.date());
    };
    if(this.scheduleCategoryOptions.length) this.form.controls.categoryId.setValue(this.scheduleCategoryOptions[0].id);
  }));

  handleGetScheduleCategoryOptions = () => this.scheduleCategoryFacade.service.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => this.scheduleCategoryOptions = response.data));
};