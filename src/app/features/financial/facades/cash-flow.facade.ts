import { inject, Injectable, Type } from "@angular/core";
import { PllFacade, PllQueryFacade } from "@pollaris";
import { CashFlow } from "../models/cash-flow.model";
import { PllFormSchemaConfig } from "@pollaris/forms";
import { CashFlowViewParams, CashFlowViewResponse, CashFlowService } from "../services/cash-flow.service";
import { CashFlowState } from "../states/cash-flow.state";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";
import moment from "moment";
import { Starters } from "@pollaris/forms/starters";

export type CashFlowUQP = CashFlowViewParams;
export type CashFlowUQR = CashFlowViewResponse;

@Injectable({ providedIn: "root" })
export class CashFlowFacade extends PllFacade<CashFlow> {
  override state = inject(CashFlowState);
  override service = inject(CashFlowService);

  override header: string = "Movimento de Caixa";
  override component: Type<any>;
  override dialogSize: DialogContentVariants["size"] = "lg";
  override dialogAlign: DialogContentVariants["align"] = "center";
  override closeOnSave: boolean = false;

  override recordSchema: PllFormSchemaConfig<CashFlow>;
};

@Injectable({ providedIn: "root" })
export class CashFlowQueryFacade extends PllQueryFacade<CashFlowUQR, CashFlowUQP> {
  override service = inject(CashFlowService);
  override queryFn = (params: CashFlowUQP) => this.service.getAllByFilter(params);

  override filterSchema: PllFormSchemaConfig<CashFlowUQP> = {
    fields: {
      centerOfCostId: { value: null },
      planOfAccountId: { value: null },
      bankAccountId: { value: null },
      secrecyId: { value: null },
      date: { value: moment().toDate(), starters: [Starters.toDate] },
      query: { value: null },
    },
  };
};