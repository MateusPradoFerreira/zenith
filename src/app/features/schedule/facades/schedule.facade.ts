import { inject, Injectable, Type } from "@angular/core";
import { PllFacade } from "../../../core/lib/pollaris";
import { Schedule } from "../models/schedule.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "../../../core/lib/pollaris/forms/refiners";
import { GetAllScheduleByFilterParams, ScheduleService } from "../services/schedule.service";
import { ScheduleState } from "../states/schedule.state";
import { ScheduleMapper } from "../mappers/schedule.mapper";
import { ScheduleFormComponent } from "../views/schedule/schedule-form/schedule-form.component";
import { DialogWidth } from "../../../common/facades/dialog.facade";
import moment from "moment";

export type ScheduleUseQueryParams = GetAllScheduleByFilterParams;

@Injectable({ providedIn: "root" })
export class ScheduleFacade extends PllFacade<Schedule, Schedule, Schedule, ScheduleUseQueryParams, ScheduleFormComponent> {
  override state = inject(ScheduleState);
  override service = inject(ScheduleService);
  override mapper = inject(ScheduleMapper);
  override queryFn = (params: ScheduleUseQueryParams) => this.service.getAllByFilter(params);

  override header: string = "Agendamento";
  override component: Type<any> = ScheduleFormComponent;
  override dialogWidth: DialogWidth = "95";
  override closeOnSave: boolean = true;

  override recordSchema: PllFormSchemaConfig<Schedule> = {
    fields: {
      id: { value: null },
      title: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      frequency: { value: "DAILY" },
      byWeekday: { value: [] },
      byMonthDay: { value: [] },
      byMonth: { value: [] },
      interval: { value: null },
      count: { value: null },
      createdAt: { value: moment().toDate() },
      startsAt: { value: moment().toDate() },
      endsAt: { value: moment().toDate() },
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