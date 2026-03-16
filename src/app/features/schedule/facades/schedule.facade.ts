import { inject, Injectable, Type } from "@angular/core";
import { PllFacade, PllQueryFacade } from "@pollaris";
import { Schedule } from "../models/schedule.model";
import { PllFormSchemaConfig } from "@pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "@pollaris/forms/refiners";
import { ScheduleViewParams, ScheduleViewResponse, ScheduleService } from "../services/schedule.service";
import { ScheduleState } from "../states/schedule.state";
import { ScheduleFormComponent } from "../views/schedule/schedule-form/schedule-form.component";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";
import moment from "moment";
import { CalendarEvent } from "angular-calendar";
import { Util } from "../../../common/util/util";
import { colors } from "../../../common/types/colors.type";
import { Starters } from "@pollaris/forms/starters";
import { catchError, Observable, of, switchMap, tap, throwError } from "rxjs";
import { RecurrenceState } from "../states/recurrence.state";

export type ScheduleUQP = ScheduleViewParams;
export type ScheduleUQR = ScheduleViewResponse;

@Injectable({ providedIn: "root" })
export class ScheduleFacade extends PllFacade<Schedule, ScheduleFormComponent> {
  override state = inject(ScheduleState);
  override service = inject(ScheduleService);

  override header: string = "Agendamento";
  override component: Type<any> = ScheduleFormComponent;
  override dialogSize: DialogContentVariants["size"] = "xs";
  override dialogAlign: DialogContentVariants["align"] = "center";
  override closeOnSave: boolean = false;

  private readonly recurrenceState = inject(RecurrenceState);

  override recordSchema: PllFormSchemaConfig<Schedule> = {
    fields: {
      id: { value: null },
      scheduleId: { value: null },
      recurrenceId: { value: null },
      categoryId: { value: null },
      title: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      frequency: { value: "NO_REPETITION", validators: [Validators.required] },
      createdAt: { value: moment().toDate(), starters: [Starters.toDate] },
      startsAt: { value: moment().toDate(), starters: [Starters.toDate] },
      endsAt: { value: moment().toDate(), starters: [Starters.toDate] },
      startsAtTime: { value: "08:00:00" },
      endsAtTime: { value: "08:00:00" },
      description: { value: null },
    },
  };

  override updateRecord(data: Schedule): Observable<Schedule> {
    return of(data).pipe(
      switchMap(record => this.service.put(record)),
      tap(response => this.state.remove(response.id)),
      tap(response => this.recurrenceState.remove(response.recurrenceId)),
      catchError(error => throwError(error)),
    );
  };
};

@Injectable({ providedIn: "root" })
export class ScheduleQueryFacade extends PllQueryFacade<ScheduleUQR, ScheduleUQP> {
  override service = inject(ScheduleService);
  override queryFn = (params: ScheduleUQP) => this.service.getAllByFilter(params);

  override filterSchema: PllFormSchemaConfig<ScheduleUQP> = {
    fields: {
      categoryIds: { value: [] },
      startsAt: { value: moment().startOf("week").toDate(), validators: [Validators.required], starters: [Starters.toDate] },
      endsAt: { value: moment().endOf("week").toDate(), validators: [Validators.required], starters: [Starters.toDate] },
    },
  };

  handleRemapEvents(schedules: ScheduleViewResponse[]): CalendarEvent[] {
    const events: CalendarEvent[] = schedules.map(schedule => ({
      id: schedule.id,
      title: schedule.title,
      start: Util.getTimedOur(schedule.startsAt, schedule.startsAtTime),
      end: Util.getTimedOur(schedule.endsAt, schedule.endsAtTime),
      color: colors[schedule.color],
      meta: schedule,
      allDay: Boolean(!schedule.startsAtTime || (moment(schedule.startsAt).format("DD/MM/YYY") !== moment(schedule.endsAt).format("DD/MM/YYY"))),
      draggable: schedule.type === "SCHEDULE",
    }));
    return events;
  };
};