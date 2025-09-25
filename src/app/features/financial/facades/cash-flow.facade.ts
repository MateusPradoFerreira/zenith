import { inject, Injectable, Type } from "@angular/core";
import { PllFacade } from "../../../core/lib/pollaris";
import { CashFlow } from "../models/cash-flow.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { GetAllCashFlowByFilterParams, CashFlowService } from "../services/cash-flow.service";
import { CashFlowState } from "../states/cash-flow.state";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";
import moment from "moment";

export type CashFlowUseQueryParams = GetAllCashFlowByFilterParams;

export class CashFlowFacade extends PllFacade<CashFlow, CashFlow, CashFlowUseQueryParams> {
  override state = inject(CashFlowState);
  override service = inject(CashFlowService);
  override queryFn = (params: CashFlowUseQueryParams) => this.service.getAllByFilter(params);

  override header: string;
  override component: Type<any>;
  override dialogSize: DialogContentVariants["size"];
  override dialogAlign: DialogContentVariants["align"] = "center";
  override closeOnSave: boolean;

  override recordSchema: PllFormSchemaConfig<CashFlow>;
  override filterSchema: PllFormSchemaConfig<CashFlowUseQueryParams> = {
    fields: {
      centerOfCostId: { value: null },
      planOfAccountId: { value: null },
      bankAccountId: { value: null },
      secrecyId: { value: null },
      startsAt: { value: moment().toDate() },
      query: { value: null },
      period: { value: "YEARLY" },
    },
  };
};