import { Component, computed, inject, model } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { ScheduleFacade, ScheduleQueryFacade, ScheduleUseQueryParams, ScheduleUseQueryResponse } from '../../../facades/schedule.facade';
import { HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import moment from 'moment';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/helm/utils';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { PllID, PllPaginatedResponse } from '@pollaris';
import { event } from '../../../../../common/directives/base-form-component.directive';
import { forkJoin, Subject, switchMap, tap } from 'rxjs';
import { ScheduleCategoryFacade } from '../../../facades/schedule-category.facade';
import { ScheduleCategory } from '../../../models/schedule-category.model';
import { ScheduleSidebarSessionComponent } from '../../../components/schedule-sidebar-session.component';
import { PayableFacade } from '../../../../financial/facades/payable.facade';
import { ReceivableFacade } from '../../../../financial/facades/receivable.facade';

@Component({
  standalone: true,
  selector: 'app-schedule-listing',
  imports: [GlobalModule, HlmDataTableComponent, ScheduleSidebarSessionComponent],
  templateUrl: './schedule-listing.component.html',
})
export class ScheduleListingComponent extends BaseRecordListingComponentDirective<ScheduleUseQueryResponse, ScheduleUseQueryParams> {
  override facade = inject(ScheduleFacade);
  override queryFacade = inject(ScheduleQueryFacade);

  scheduleCategoryFacade = inject(ScheduleCategoryFacade);
  payableFacade = inject(PayableFacade);
  receivableFacade = inject(ReceivableFacade);
  
  categoryOptions: ScheduleCategory[] = [];
  otherCategoryOptions: ScheduleCategory[] = [];

  events = model<CalendarEvent[]>([]);
  date = model<Date>(new Date());
  range = model<"day" | "week" | "month">("week");
  layout = model<"table" | "calendar">("calendar");
  sidebarActive = model<boolean>(true);
  monthDayOpen = model<boolean>(false);

  dayIsClicked: boolean = false;
  dayClickTimeout: NodeJS.Timeout;
  categoryTimeout: NodeJS.Timeout;

  calendarRefresh = new Subject<void>();

  groupedValues = computed<{ date: Date, values: ScheduleUseQueryResponse[] }[]>(() => {
    if(this.layout() === "calendar") return [];
    const groups: Record<string, ScheduleUseQueryResponse[]> = {};
    for (const item of this.values()) {
      const day = moment(item.startsAt).startOf("day").format("YYYY-MM-DD");
      if (!groups[day]) groups[day] = [];
      groups[day].push(item);
    };

    return Object.entries(groups).map(([day, schedules]) => ({
      date: moment(day, "YYYY-MM-DD").toDate(),
      values: schedules,
    }));
  });

  styleClass = computed<ClassValue>(() => hlm(
    this._computedClass(),
    "grid grid-rows-1 h-full grid-cols-1 relative",
    /* this.sidebarActive() && "grid-cols-[296px_1fr]", */
  ));

  isToday = computed<boolean>(() => moment().format("DD-MM-YYYY") === moment(this.date()).format("DD-MM-YYYY"));

  override $evNgOnInit = event(switchMap(() => forkJoin({
    a: this.$getScheduleCategoryOptions(),
  })));

  override $evUpdateUI = event<PllPaginatedResponse<ScheduleUseQueryResponse>>(tap(() => this.handleRemapEvents()));

  getScheduleCategoryOptions() {
    this.$getScheduleCategoryOptions().subscribe({
      error: error => console.error(error),
    });
  };

  $getScheduleCategoryOptions = () => this.scheduleCategoryFacade.service.getAllByFilter({ status: "ACTIVE" }).pipe(tap(response => {
    this.categoryOptions = response.data.filter(record => record.type === "SCHEDULE");
    this.otherCategoryOptions = response.data.filter(record => record.type !== "SCHEDULE");
    this.filter.controls.categoryIds.setValue(response.data.map(record => record.id));
  }));

  handleRemapEvents() {
    this.events.set(this.queryFacade.handleRemapEvents(this.values()));
    console.log("EVENTS", this.events());
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

  scheduleCategoryIsSelected(id: PllID) {
    return this.filter.value.categoryIds.includes(id);
  };

  toggleScheduleCategorySelection(id: PllID) {
    clearTimeout(this.categoryTimeout);
    if( this.filter.value.categoryIds.includes(id)) {
      this.filter.controls.categoryIds.setValue( this.filter.value.categoryIds.filter(cId => cId !== id));
    } else {
      this.filter.controls.categoryIds.setValue([... this.filter.value.categoryIds, id]);
    };
    this.categoryTimeout = setTimeout(() => this.updateUI(), 300);
  };

  handleUpdateRecord(rowData: ScheduleUseQueryResponse) {
    console.log(rowData)
    switch (rowData.type) {
      case "PAYABLE": 
        this.payableFacade.openToUpdate(rowData.id).subscribe(() => this.updateUI()); 
        break;
      case "RECEIVABLE": 
        this.receivableFacade.openToUpdate(rowData.id).subscribe(() => this.updateUI()); 
        break;
      default: 
        this.handleUpdate(rowData);
    };
  };

  eventTimesChanged({ event, newStart, newEnd, allDay }: CalendarEventTimesChangedEvent) {
    event.start = newStart;
    event.end = newEnd;

    this.calendarRefresh.next();

    const startsAtTime = allDay? null : moment(newStart).format("HH:mm:ss");
    const endsAtTime = allDay? null : moment(newEnd).format("HH:mm:ss");

    this.facade.getRecord(event.meta.id).pipe(switchMap(response => this.facade.updateRecord({ ...response, startsAt: newStart, endsAt: newEnd, startsAtTime, endsAtTime }))).subscribe({
      error: (error) => console.log(error),
    });
  };

  dayClicked(date: Date, inMonth: boolean, setDateHour: boolean = false) {
    if(!inMonth) return;
    if(this.dayIsClicked) {
      clearTimeout(this.dayClickTimeout);
      this.dayIsClicked = false;
      this.facade.openToCreate({ date, setDateHour }).subscribe(() => this.updateUI());
      return;
    };

    this.dayIsClicked = true;
    this.dayClickTimeout = setTimeout(() => {
      this.dayIsClicked = false;
      this.date.set(date);
    }, 200);
  };

  handleCreateScheduleCategory() {
    this.scheduleCategoryFacade.openToCreate().subscribe({
      next: response => response && this.getScheduleCategoryOptions(),
    });
  };

  handleUpdateScheduleCategory(id: PllID) {
    this.scheduleCategoryFacade.openToUpdate(id).subscribe({
      next: response => response && this.getScheduleCategoryOptions(),
    });
  };

};