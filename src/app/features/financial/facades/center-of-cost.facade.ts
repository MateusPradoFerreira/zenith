import { inject, Injectable, Type } from "@angular/core";
import { PllFacade } from "../../../core/lib/pollaris";
import { CenterOfCost } from "../models/center-of-cost.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "../../../core/lib/pollaris/forms/refiners";
import { GetAllCenterOfCostByFilterParams, CenterOfCostService } from "../services/center-of-cost.service";
import { CenterOfCostState } from "../states/center-of-cost.state";
import { CenterOfCostFormComponent } from "../views/center-of-cost/center-of-cost-form/center-of-cost-form.component";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";

export type CenterOfCostUseQueryParams = GetAllCenterOfCostByFilterParams;

@Injectable({ providedIn: "root" })
export class CenterOfCostFacade extends PllFacade<CenterOfCost, CenterOfCost, CenterOfCostUseQueryParams, CenterOfCostFormComponent> {
  override state = inject(CenterOfCostState);
  override service = inject(CenterOfCostService);
  override queryFn = (params: CenterOfCostUseQueryParams) => this.service.getAllByFilter(params);

  override header: string = "Centro de Custo";
  override component: Type<any> = CenterOfCostFormComponent;
  override dialogSize: DialogContentVariants["size"] = "sm";
  override dialogAlign: DialogContentVariants["align"] = "center";
  override closeOnSave: boolean = true;

  override recordSchema: PllFormSchemaConfig<CenterOfCost> = {
    fields: {
      id: { value: null },
      name: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      active: { value: true },
    },
  };

  override filterSchema: PllFormSchemaConfig<CenterOfCostUseQueryParams> = {
    fields: {
      status: { value: "ACTIVE" },
    },
  };
};