import { inject, Injectable, Type } from "@angular/core";
import { PllFacade } from "../../../core/lib/pollaris";
import { Schedule, ScheduleWeekday } from "../models/schedule.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "../../../core/lib/pollaris/forms/refiners";
import { GetAllScheduleByFilterParams, ScheduleService } from "../services/schedule.service";
import { ScheduleState } from "../states/schedule.state";
import { ScheduleMapper } from "../mappers/schedule.mapper";
import { ScheduleFormComponent } from "../views/schedule/schedule-form/schedule-form.component";
import { DialogWidth } from "../../../common/facades/dialog.facade";
import moment from "moment";
import { SelectItem } from "../../../common/types/select-item.type";

export type ScheduleUseQueryParams = GetAllScheduleByFilterParams;

@Injectable({ providedIn: "root" })
export class ScheduleFacade extends PllFacade<Schedule, Schedule, Schedule, ScheduleUseQueryParams, ScheduleFormComponent> {
  override state = inject(ScheduleState);
  override service = inject(ScheduleService);
  override mapper = inject(ScheduleMapper);
  override queryFn = (params: ScheduleUseQueryParams) => this.service.getAllByFilter(params);

  override header: string = "Agendamento";
  override component: Type<any> = ScheduleFormComponent;
  override dialogWidth: DialogWidth = "lg";
  override closeOnSave: boolean = true;

  override recordSchema: PllFormSchemaConfig<Schedule> = {
    fields: {
      id: { value: null },
      categoryId: { value: null },
      title: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      frequency: { value: "NO_REPETITION", onChange: (value, form) => {
        if(value !== "WEEKLY") return;
        const weekdayIndex = moment(form.value.startsAt).isoWeekday();
        const weekdayMap: Record<number, ScheduleWeekday> = { 1: "MO", 2: "TU", 3: "WE", 4: "TH", 5: "FR", 6: "SA", 7: "SU" };
        const weekday: ScheduleWeekday = weekdayMap[weekdayIndex];
        form.controls.byWeekday.setValue([weekday]);
      }},
      byWeekday: { value: [] },
      byMonthDay: { value: [] },
      byMonth: { value: [] },
      interval: { value: 1 },
      count: { value: 1 },
      createdAt: { value: moment().toDate() },
      startsAt: { value: moment().toDate() },
      endsAt: { value: moment().toDate() },
      startsAtTime: { value: "08:00:00" },
      endsAtTime: { value: "08:00:00" },
      exceptions: { value: [] },
    },
  };

  override filterSchema: PllFormSchemaConfig<ScheduleUseQueryParams> = {
    fields: {
      startsAt: { value: moment().startOf("month").toDate(), validators: [Validators.required] },
      endsAt: { value: moment().endOf("month").toDate(), validators: [Validators.required] },
    },
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