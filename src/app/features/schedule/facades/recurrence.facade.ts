import { inject, Injectable, Type } from "@angular/core";
import { PllFacade } from "../../../core/lib/pollaris";
import { Recurrence } from "../models/recurrence.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { Validators } from "@angular/forms";
import { RecurrenceService } from "../services/recurrence.service";
import { RecurrenceState } from "../states/recurrence.state";
import { RecurrenceFormComponent } from "../views/recurrence/recurrence-form/recurrence-form.component";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";
import moment from "moment";
import { SelectItem } from "../../../common/types/select-item.type";

@Injectable({ providedIn: "root" })
export class RecurrenceFacade extends PllFacade<Recurrence, RecurrenceFormComponent> {
  override state = inject(RecurrenceState);
  override service = inject(RecurrenceService);

  override header: string = "Categoria";
  override component: Type<any> = RecurrenceFormComponent;
  override dialogSize: DialogContentVariants["size"] = "sm";
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
};

export const RecurrenceWeekdayOptions: SelectItem[] = [
  { label: "Segunda-feira", value: "MO" },
  { label: "Terça-feira", value: "TU" },
  { label: "Quarta-feira", value: "WE" },
  { label: "Quinta-feira", value: "TH" },
  { label: "Sexta-feira", value: "FR" },
  { label: "Sábado", value: "SA" },
  { label: "Domingo", value: "SU" },
];