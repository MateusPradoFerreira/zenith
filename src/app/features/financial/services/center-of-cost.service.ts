import { PllPaginatedResponse, PllRestService } from "@pollaris";
import { CenterOfCost } from "../models/center-of-cost.model";
import { map, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type CenterOfCostViewParams = {
  status?: "ACTIVE" | "INACTIVE" | "ALL";
};

@Injectable()
export class CenterOfCostService extends PllRestService<CenterOfCost> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "centers-of-cost";

  getAllByFilter({ status }: CenterOfCostViewParams): Observable<PllPaginatedResponse<CenterOfCost>> {
    return this.http.get<CenterOfCost[]>(`${this.baseRoute}/${this.pathRoute}`, { params: {
      status,
    }}).pipe(map(response => ({ data: response, pagination: { page: 1, size: 100, sort: "ASC", total: response.length }})));
  };
};