import { PllPaginatedResponse, PllRestService } from "@pollaris";
import { CashFlow } from "../models/cash-flow.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type GetAllCashFlowByFilterParams = {
  year: number;
  query?: string;
};

export type GetAllCashFlowByFilterResponse = CashFlow;

@Injectable()
export class CashFlowService extends PllRestService<CashFlow> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "cash-flow";

  getAllByFilter(params: GetAllCashFlowByFilterParams): Observable<PllPaginatedResponse<GetAllCashFlowByFilterResponse>> {
    return this.http.get<PllPaginatedResponse<GetAllCashFlowByFilterResponse>>(`${this.baseRoute}/${this.pathRoute}`, { params });
  };
};