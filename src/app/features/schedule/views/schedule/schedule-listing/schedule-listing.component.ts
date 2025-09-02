import { Component, computed, inject, model, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { GetAllScheduleByFilterParams, GetAllScheduleByFilterResponse } from '../../../services/schedule.service';
import { ScheduleFacade } from '../../../facades/schedule.facade';
import { HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import moment from 'moment';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/brain/core';
import { CalendarEvent } from 'angular-calendar';
import { PllPaginatedResponse } from '@pollaris';
import { event } from '../../../../../common/directives/base-form-component.directive';
import { tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-schedule-listing',
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: './schedule-listing.component.html',
})
export class ScheduleListingComponent extends BaseRecordListingComponentDirective<GetAllScheduleByFilterResponse, GetAllScheduleByFilterParams> {
  override facade = inject(ScheduleFacade);
  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "N° Doc.", class: "w-44" },
    { header: "Title", class: "flex-1" },
    { header: "Conta Bancária", class: "w-42" },
    { header: "Centro de Custo", class: "w-42" },
    { header: "Plano de Conta", class: "w-42" },
    { header: "Valor", class: "w-36 justify-end" },
    { header: "Status", class: "w-36" },
    { header: "Emissão", class: "w-36" },
    { header: "Vencimento", class: "w-36" },
  ]);

  events = model<CalendarEvent[]>([]);
  date = model<Date>(new Date());
  range = model<"day" | "week" | "month">("week");
  layout = model<"table" | "calendar">("calendar");
  sidebarActive = model<boolean>(true);

  styleClass = computed<ClassValue>(() => hlm(
    this._computedClass(),
    "grid grid-rows-1 h-full grid-cols-1",
    this.sidebarActive() && "grid-cols-[296px_1fr]",
  ));

  isToday = computed<boolean>(() => moment().format("DD-MM-YYYY") === moment(this.date()).format("DD-MM-YYYY"));

  override onUpdateUI = event<PllPaginatedResponse<GetAllScheduleByFilterResponse>>(tap(() => this.handleRemapEvents()));

  handleRemapEvents() {
    this.events.set(this.facade.handleRemapEvents(this.values()));
  };

  handleChangeRange(range?: "day" | "week" | "month") {
    if(range) this.range.set(range);
    if(!this.date()) this.date.set(new Date());
    this.filter.controls.startsAt.setValue(moment(this.date()).startOf(this.range()).toDate());
    this.filter.controls.endsAt.setValue(moment(this.date()).endOf(this.range()).toDate());
    this.updateUI();
  };

  handleSetNextRange() {
    this.date.set(moment(this.date()).add(1, this.range()).toDate());
    this.handleChangeRange();
  };

  handleSetPrevRange() {
    this.date.set(moment(this.date()).subtract(1, this.range()).toDate());
    this.handleChangeRange();
  };

  onDateChange(date?: Date) {
    this.date.set(date || new Date());
    this.handleChangeRange();
  };
};