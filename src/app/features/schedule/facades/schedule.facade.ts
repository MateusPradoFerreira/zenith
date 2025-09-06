import { inject, Injectable, Type } from "@angular/core";
import { PllFacade } from "../../../core/lib/pollaris";
import { Schedule } from "../models/schedule.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "../../../core/lib/pollaris/forms/refiners";
import { GetAllScheduleByFilterParams, GetAllScheduleByFilterResponse, ScheduleService } from "../services/schedule.service";
import { ScheduleState } from "../states/schedule.state";
import { ScheduleFormComponent } from "../views/schedule/schedule-form/schedule-form.component";
import moment from "moment";
import { SelectItem } from "../../../common/types/select-item.type";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";
import { CalendarEvent } from "angular-calendar";
import { Util } from "../../../common/util/util";
import { colors } from "../../../common/types/colors.type";

export type ScheduleUseQueryParams = GetAllScheduleByFilterParams;

@Injectable({ providedIn: "root" })
export class ScheduleFacade extends PllFacade<Schedule, GetAllScheduleByFilterResponse, ScheduleUseQueryParams, ScheduleFormComponent> {
  override state = inject(ScheduleState);
  override service = inject(ScheduleService);
  override queryFn = (params: ScheduleUseQueryParams) => this.service.getAllByFilter(params);

  override header: string = "Agendamento";
  override component: Type<any> = ScheduleFormComponent;
  override dialogWidth: DialogContentVariants["width"] = "lg";
  override closeOnSave: boolean = true;

  override recordSchema: PllFormSchemaConfig<Schedule> = {
    fields: {
      id: { value: null },
      scheduleId: { value: null },
      recurrenceId: { value: null },
      categoryId: { value: null },
      title: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      createdAt: { value: moment().toDate() },
      startsAt: { value: moment().toDate() },
      endsAt: { value: moment().toDate() },
      startsAtTime: { value: "08:00:00" },
      endsAtTime: { value: "08:00:00" },
    },
  };

  override filterSchema: PllFormSchemaConfig<ScheduleUseQueryParams> = {
    fields: {
      categoryIds: { value: [] },
      startsAt: { value: moment().startOf("week").add(1, "day").toDate(), validators: [Validators.required] },
      endsAt: { value: moment().endOf("week").add(1, "day").toDate(), validators: [Validators.required] },
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
      allDay: schedule.startsAtTime? false : true,
    }));
    return events;
  };
};

export const ScheduleFrequencyOptions: SelectItem[] = [
  { label: "Não se repete", value: "NO_REPETITION" },
  { label: "Diariamente", value: "DAILY" },
  { label: "Semanalmente", value: "WEEKLY" },
  { label: "Mensalmente", value: "MONTHLY" },
  { label: "Anualmente", value: "YEARLY" },
];

export const ScheduleWeekdayOptions: SelectItem[] = [
  { label: "Segunda-feira", value: "MO" },
  { label: "Terça-feira", value: "TU" },
  { label: "Quarta-feira", value: "WE" },
  { label: "Quinta-feira", value: "TH" },
  { label: "Sexta-feira", value: "FR" },
  { label: "Sábado", value: "SA" },
  { label: "Domingo", value: "SU" },
];