import { inject, Injectable, Type } from "@angular/core";
import { PllFacade, PllQueryFacade } from "@pollaris";
import { ScheduleCategory } from "../models/schedule-category.model";
import { PllFormSchemaConfig } from "@pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "@pollaris/forms/refiners";
import { ScheduleCategoryViewParams, ScheduleCategoryService } from "../services/schedule-category.service";
import { ScheduleCategoryState } from "../states/schedule-category.state";
import { ScheduleCategoryFormComponent } from "../views/schedule-category/schedule-category-form/schedule-category-form.component";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";

export type ScheduleCategoryUQP = ScheduleCategoryViewParams;
export type ScheduleCategoryUQR = ScheduleCategory;

@Injectable({ providedIn: "root" })
export class ScheduleCategoryFacade extends PllFacade<ScheduleCategory, ScheduleCategoryFormComponent> {
  override state = inject(ScheduleCategoryState);
  override service = inject(ScheduleCategoryService);

  override header: string = "Categoria de Agendamento";
  override component: Type<any> = ScheduleCategoryFormComponent;
  override dialogSize: DialogContentVariants["size"] = "md";
  override dialogAlign: DialogContentVariants["align"] = "center";
  override closeOnSave: boolean = true;

  override recordSchema: PllFormSchemaConfig<ScheduleCategory> = {
    fields: {
      id: { value: null },
      name: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      color: { value: "VIOLET", validators: [Validators.required] },
      active: { value: true },
      type: { value: "SCHEDULE", onChange: (value, form) => {
        if(value !== "SCHEDULE") form.controls.name.disable();
      }},
    },
  };
};

@Injectable({ providedIn: "root" })
export class ScheduleCategoryQueryFacade extends PllQueryFacade<ScheduleCategoryUQR, ScheduleCategoryUQP> {
  override service = inject(ScheduleCategoryService);
  override queryFn = (params: ScheduleCategoryUQP) => this.service.getAllByFilter(params);

  override filterSchema: PllFormSchemaConfig<ScheduleCategoryUQP> = {
    fields: {
      status: { value: "ACTIVE" },
      type: { value: "ALL" },
    },
  };
};