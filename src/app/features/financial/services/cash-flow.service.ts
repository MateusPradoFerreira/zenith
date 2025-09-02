import { PllID, PllPaginatedResponse, PllRestService } from "@pollaris";
import { CashFlow } from "../models/cash-flow.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";
import moment from "moment";

export type GetAllCashFlowByFilterParams = {
  centerOfCostId?: PllID | null;
  planOfAccountId?: PllID | null;
  secrecyId?: PllID | null;
  bankAccountId?: PllID | null;
  query?: string;
  period: "YEARLY" | "MONTHLY";
  startsAt: Date;
};

export type GetAllCashFlowByFilterResponse = CashFlow;

@Injectable()
export class CashFlowService extends PllRestService<CashFlow> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "cash-flow";

  getAllByFilter({ startsAt, ...params }: GetAllCashFlowByFilterParams): Observable<PllPaginatedResponse<GetAllCashFlowByFilterResponse>> {
    return this.http.get<PllPaginatedResponse<GetAllCashFlowByFilterResponse>>(`${this.baseRoute}/${this.pathRoute}`, { params: {
      ...params,
      startsAt: moment(startsAt).format("YYYY-MM-DD"),
    }});
  };
};