import { PllPaginatedResponse, PllRestService } from "@pollaris";
import { CenterOfCost } from "../models/center-of-cost.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type GetAllCenterOfCostByFilterParams = {
  status?: "ACTIVE" | "INACTIVE" | "ALL";
};

@Injectable()
export class CenterOfCostService extends PllRestService<CenterOfCost> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "center-of-cost";

  getAllByFilter({ status }: GetAllCenterOfCostByFilterParams): Observable<PllPaginatedResponse<CenterOfCost>> {
    return this.http.get<PllPaginatedResponse<CenterOfCost>>(`${this.baseRoute}/${this.pathRoute}`, { params: {
      status,
    }});
  };
};