import { PllPaginatedResponse, PllRestService } from "@pollaris";
import { CenterOfCost } from "../models/center-of-cost.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type GetAllCenterOfCostByFilterParams = {
  status?: "ACTIVE" | "INACTIVE" | "ALL";
};

export type GetAllCenterOfCostByFilterResponse = CenterOfCost;

@Injectable()
export class CenterOfCostService extends PllRestService<CenterOfCost> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "secrecy";

  getAllByFilter({ status }: GetAllCenterOfCostByFilterParams): Observable<PllPaginatedResponse<GetAllCenterOfCostByFilterResponse>> {
    return this.http.get<PllPaginatedResponse<GetAllCenterOfCostByFilterResponse>>(`${this.baseRoute}/${this.pathRoute}`, { params: {
      status,
    }});
  };
};