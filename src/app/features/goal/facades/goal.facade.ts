import { inject, Injectable, Type } from "@angular/core";
import { PllFacade } from "../../../core/lib/pollaris";
import { Goal } from "../models/goal.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "../../../core/lib/pollaris/forms/refiners";
import { GetAllGoalByFilterParams, GetAllGoalByFilterResponse, GoalService } from "../services/goal.service";
import { GoalState } from "../states/goal.state";
import { GoalMapper } from "../mappers/goal.mapper";
import { GoalFormComponent } from "../views/goal/goal-form/goal-form.component";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";

export type GoalUseQueryParams = GetAllGoalByFilterParams;

@Injectable({ providedIn: "root" })
export class GoalFacade extends PllFacade<Goal, Goal, GetAllGoalByFilterResponse, GoalUseQueryParams, GoalFormComponent> {
  override state = inject(GoalState);
  override service = inject(GoalService);
  override mapper = inject(GoalMapper);
  override queryFn = (params: GoalUseQueryParams) => this.service.getAllByFilter(params);

  override header: string = "Meta";
  override component: Type<any> = GoalFormComponent;
  override dialogWidth: DialogContentVariants["width"] = "sm";
  override closeOnSave: boolean = true;

  override recordSchema: PllFormSchemaConfig<Goal> = {
    fields: {
      id: { value: null },
      scheduleId: { value: null },
      name: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      color: { value: "VIOLET" },
      description: { value: null },
      duration: { value: 30 },
    },
  };

  override filterSchema: PllFormSchemaConfig<GoalUseQueryParams> = {
    fields: {
      status: { value: "ALL" },
      startsAt: { value: new Date() },
    },
  };
};