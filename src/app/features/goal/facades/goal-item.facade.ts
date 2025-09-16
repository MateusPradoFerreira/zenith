import { inject, Injectable, Type } from "@angular/core";
import { PllFacade } from "../../../core/lib/pollaris";
import { GoalItem } from "../models/goal-item.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { GetAllGoalItemByFilterParams, GoalItemService } from "../services/goal-item.service";
import { GoalItemState } from "../states/goal-item.state";
import { GoalItemFormComponent } from "../views/goal-item/goal-item-form/goal-item-form.component";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";
import moment from "moment";

export type GoalItemUseQueryParams = GetAllGoalItemByFilterParams;

@Injectable({ providedIn: "root" })
export class GoalItemFacade extends PllFacade<GoalItem, GoalItem, GoalItemUseQueryParams, GoalItemFormComponent> {
  override state = inject(GoalItemState);
  override service = inject(GoalItemService);
  override queryFn = (params: GoalItemUseQueryParams) => this.service.getAllByFilter(params);

  override header: string = "Meta";
  override component: Type<any> = GoalItemFormComponent;
  override dialogSize: DialogContentVariants["size"] = "sm";
  override closeOnSave: boolean = true;

  override recordSchema: PllFormSchemaConfig<GoalItem> = {
    fields: {
      id: { value: null },
      goalId: { value: null },
      description: { value: null },
      duration: { value: 30 },
      startsAt: { value: new Date() },
      startsAtTime: { value: moment().format("HH:mm:ss") },
    },
  };

  override filterSchema: PllFormSchemaConfig<GoalItemUseQueryParams> = {
    fields: {
      goalId: { value: null },
    },
  };
};