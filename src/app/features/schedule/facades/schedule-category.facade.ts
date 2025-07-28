import { inject, Injectable, Type } from "@angular/core";
import { PllFacade } from "../../../core/lib/pollaris";
import { ScheduleCategory } from "../models/schedule-category.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "../../../core/lib/pollaris/forms/refiners";
import { GetAllScheduleCategoryByFilterParams, ScheduleCategoryService } from "../services/schedule-category.service";
import { ScheduleCategoryState } from "../states/schedule-category.state";
import { ScheduleCategoryMapper } from "../mappers/schedule-category.mapper";
import { ScheduleCategoryFormComponent } from "../views/schedule-category/schedule-category-form/schedule-category-form.component";
import { DialogWidth } from "../../../common/facades/dialog.facade";

export type ScheduleCategoryUseQueryParams = GetAllScheduleCategoryByFilterParams;

@Injectable({ providedIn: "root" })
export class ScheduleCategoryFacade extends PllFacade<ScheduleCategory, ScheduleCategory, ScheduleCategory, ScheduleCategoryUseQueryParams, ScheduleCategoryFormComponent> {
  override state = inject(ScheduleCategoryState);
  override service = inject(ScheduleCategoryService);
  override mapper = inject(ScheduleCategoryMapper);
  override queryFn = (params: ScheduleCategoryUseQueryParams) => this.service.getAllByFilter(params);

  override header: string = "Categoria";
  override component: Type<any> = ScheduleCategoryFormComponent;
  override dialogWidth: DialogWidth = "sm";
  override closeOnSave: boolean = true;

  override recordSchema: PllFormSchemaConfig<ScheduleCategory> = {
    fields: {
      id: { value: null },
      name: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      type: { value: "SCHEDULE", validators: [Validators.required], onChange: (value, form) => {
        if(value !== "SCHEDULE") form.controls.name.disable();
      }},
      color: { value: "#2b7fff", validators: [Validators.required] },
      active: { value: true },
    },
  };

  override filterSchema: PllFormSchemaConfig<ScheduleCategoryUseQueryParams> = {
    fields: {
      type: { value: "ALL" },
      status: { value: "ACTIVE" },
    },
  };
};