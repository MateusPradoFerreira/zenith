import { inject, Injectable, Type } from "@angular/core";
import { PllFacade } from "../../../core/lib/pollaris";
import { ScheduleCategory } from "../models/schedule-category.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "../../../core/lib/pollaris/forms/refiners";
import { GetAllScheduleCategoryByFilterParams, ScheduleCategoryService } from "../services/schedule-category.service";
import { ScheduleCategoryState } from "../states/schedule-category.state";
import { ScheduleCategoryFormComponent } from "../views/schedule-category/schedule-category-form/schedule-category-form.component";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";

export type ScheduleCategoryUseQueryParams = GetAllScheduleCategoryByFilterParams;

@Injectable({ providedIn: "root" })
export class ScheduleCategoryFacade extends PllFacade<ScheduleCategory, ScheduleCategory, ScheduleCategoryUseQueryParams, ScheduleCategoryFormComponent> {
  override state = inject(ScheduleCategoryState);
  override service = inject(ScheduleCategoryService);
  override queryFn = (params: ScheduleCategoryUseQueryParams) => this.service.getAllByFilter(params);

  override header: string = "Categoria";
  override component: Type<any> = ScheduleCategoryFormComponent;
  override dialogWidth: DialogContentVariants["width"] = "sm";
  override closeOnSave: boolean = true;

  override recordSchema: PllFormSchemaConfig<ScheduleCategory> = {
    fields: {
      id: { value: null },
      name: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      color: { value: "VIOLET", validators: [Validators.required] },
      active: { value: true },
    },
  };

  override filterSchema: PllFormSchemaConfig<ScheduleCategoryUseQueryParams> = {
    fields: {
      status: { value: "ACTIVE" },
    },
  };
};