import { inject, Injectable, Type } from "@angular/core";
import { PllFacade, PllQueryFacade } from "../../../core/lib/pollaris";
import { Schedule } from "../models/schedule.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "../../../core/lib/pollaris/forms/refiners";
import { GetAllScheduleByFilterParams, GetAllScheduleByFilterResponse, ScheduleService } from "../services/schedule.service";
import { ScheduleState } from "../states/schedule.state";
import { ScheduleFormComponent } from "../views/schedule/schedule-form/schedule-form.component";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";
import moment from "moment";
import { CalendarEvent } from "angular-calendar";
import { Util } from "../../../common/util/util";
import { colors } from "../../../common/types/colors.type";

export type ScheduleUseQueryParams = GetAllScheduleByFilterParams;
export type ScheduleUseQueryResponse = GetAllScheduleByFilterResponse;

@Injectable({ providedIn: "root" })
export class ScheduleFacade extends PllFacade<Schedule, ScheduleFormComponent> {
  override state = inject(ScheduleState);
  override service = inject(ScheduleService);

  override header: string = "Categoria";
  override component: Type<any> = ScheduleFormComponent;
  override dialogSize: DialogContentVariants["size"] = "xs";
  override dialogAlign: DialogContentVariants["align"] = "center";
  override closeOnSave: boolean = false;

  override recordSchema: PllFormSchemaConfig<Schedule> = {
    fields: {
      id: { value: null },
      scheduleId: { value: null },
      recurrenceId: { value: null },
      categoryId: { value: null },
      title: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      frequency: { value: "NO_REPETITION", validators: [Validators.required] },
      createdAt: { value: moment().toDate() },
      startsAt: { value: moment().toDate() },
      endsAt: { value: moment().toDate() },
      startsAtTime: { value: "08:00:00" },
      endsAtTime: { value: "08:00:00" },
    },
  };
};

@Injectable({ providedIn: "root" })
export class ScheduleQueryFacade extends PllQueryFacade<ScheduleUseQueryResponse, ScheduleUseQueryParams> {
  override service = inject(ScheduleService);
  override queryFn = (params: ScheduleUseQueryParams) => this.service.getAllByFilter(params);

  override filterSchema: PllFormSchemaConfig<ScheduleUseQueryParams> = {
    fields: {
      categoryIds: { value: [] },
      startsAt: { value: moment().startOf("week").toDate(), validators: [Validators.required] },
      endsAt: { value: moment().endOf("week").toDate(), validators: [Validators.required] },
    },
  };

  handleRemapEvents(schedules: GetAllScheduleByFilterResponse[]): CalendarEvent[] {
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