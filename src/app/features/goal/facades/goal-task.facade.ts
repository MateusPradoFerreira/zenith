import { inject, Injectable, Type } from "@angular/core";
import { PllFacade } from "../../../core/lib/pollaris";
import { GoalTask } from "../models/goal-task.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { GetAllGoalTaskByFilterParams, GoalTaskService } from "../services/goal-task.service";
import { GoalTaskState } from "../states/goal-task.state";
import { GoalTaskMapper } from "../mappers/goal-task.mapper";
import { GoalTaskFormComponent } from "../views/goal-task/goal-task-form/goal-task-form.component";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";
import moment from "moment";
import { Validators } from "@angular/forms";
import { Refiners } from "@pollaris/forms/refiners";

export type GoalTaskUseQueryParams = GetAllGoalTaskByFilterParams;

@Injectable({ providedIn: "root" })
export class GoalTaskFacade extends PllFacade<GoalTask, GoalTask, GoalTask, GoalTaskUseQueryParams, GoalTaskFormComponent> {
  override state = inject(GoalTaskState);
  override service = inject(GoalTaskService);
  override mapper = inject(GoalTaskMapper);
  override queryFn = (params: GoalTaskUseQueryParams) => this.service.getAllByFilter(params);

  override header: string = "Meta";
  override component: Type<any> = GoalTaskFormComponent;
  override dialogWidth: DialogContentVariants["width"] = "sm";
  override closeOnSave: boolean = true;

  override recordSchema: PllFormSchemaConfig<GoalTask> = {
    fields: {
      id: { value: null },
      goalId: { value: null },
      name: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      description: { value: null },
      duration: { value: 30 },
      color: { value: "VIOLET" },
    },
  };

  override filterSchema: PllFormSchemaConfig<GoalTaskUseQueryParams> = {
    fields: {
      goalId: { value: null },
    },
  };
};