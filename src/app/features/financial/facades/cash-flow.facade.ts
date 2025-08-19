import { inject, Injectable, Type } from "@angular/core";
import { PllFacade } from "../../../core/lib/pollaris";
import { CashFlow } from "../models/cash-flow.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { GetAllCashFlowByFilterParams, CashFlowService } from "../services/cash-flow.service";
import { CashFlowState } from "../states/cash-flow.state";
import { CashFlowMapper } from "../mappers/cash-flow.mapper";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";
import moment from "moment";

export type CashFlowUseQueryParams = GetAllCashFlowByFilterParams;

@Injectable({ providedIn: "root" })
export class CashFlowFacade extends PllFacade<CashFlow, CashFlow, CashFlow, CashFlowUseQueryParams> {
  override state = inject(CashFlowState);
  override service = inject(CashFlowService);
  override mapper = inject(CashFlowMapper);
  override queryFn = (params: CashFlowUseQueryParams) => this.service.getAllByFilter(params);

  override header: string;
  override component: Type<any>;
  override dialogWidth: DialogContentVariants["width"];
  override closeOnSave: boolean;

  override recordSchema: PllFormSchemaConfig<CashFlow>;
  override filterSchema: PllFormSchemaConfig<CashFlowUseQueryParams> = {
    fields: {
      year: { value: moment().get("year") },
    },
  };
};