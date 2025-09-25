import { inject, Injectable, Type } from "@angular/core";
import { PllFacade } from "../../../core/lib/pollaris";
import { Recurrence } from "../models/recurrence.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { Validators } from "@angular/forms";
import { RecurrenceService } from "../services/recurrence.service";
import { RecurrenceState } from "../states/recurrence.state";
import { RecurrenceFormComponent } from "../views/recurrence/recurrence-form/recurrence-form.component";
import moment from "moment";
import { SelectItem } from "../../../common/types/select-item.type";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";

export class RecurrenceFacade extends PllFacade<Recurrence, any, any, RecurrenceFormComponent> {
  override state = inject(RecurrenceState);
  override service = inject(RecurrenceService);
  override queryFn: any;

  override header: string = "Recorrencia";
  override component: Type<any> = RecurrenceFormComponent;
  override dialogSize: DialogContentVariants["size"] = "xs";
  override dialogAlign: DialogContentVariants["align"] = "center";
  override closeOnSave: boolean = true;

  override recordSchema: PllFormSchemaConfig<Recurrence> = {
    fields: {
      id: { value: null },
      frequency: { value: "DAILY", validators: [Validators.required] },
      byWeekday: { value: [] },
      byMonthDay: { value: [] },
      byMonth: { value: [] },
      interval: { value: 1 },
      count: { value: 1 },
      createdAt: { value: moment().toDate() },
      startsAt: { value: moment().toDate() },
      endsAt: { value: moment().toDate() },
      exceptions: { value: [] },
      type: { value: "SCHEDULE" },
      active: { value: true },
    },
  };

  override filterSchema: PllFormSchemaConfig<any>;
};

export const RecurrenceFrequencyOptions: SelectItem[] = [
  { label: "Diariamente", value: "DAILY" },
  { label: "Semanalmente", value: "WEEKLY" },
  { label: "Mensalmente", value: "MONTHLY" },
  { label: "Anualmente", value: "YEARLY" },
];

export const RecurrenceWeekdayOptions: SelectItem[] = [
  { label: "Segunda-feira", value: "MO" },
  { label: "Terça-feira", value: "TU" },
  { label: "Quarta-feira", value: "WE" },
  { label: "Quinta-feira", value: "TH" },
  { label: "Sexta-feira", value: "FR" },
  { label: "Sábado", value: "SA" },
  { label: "Domingo", value: "SU" },
];