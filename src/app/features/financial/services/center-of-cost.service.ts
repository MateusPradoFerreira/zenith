import { Observable } from "rxjs";
import { BaseService } from "../../../core/base/base-service";
import { CenterOfCost } from "../models/center-of-cost.model";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type GetAllCenterOfCostByFilterParams = {
  status: "ALL" | "ACTIVE" | "INACTIVE";
};

@Injectable()
export class CenterOfCostService extends BaseService<CenterOfCost> {
  route: string = "centerOfCost";

  getAllByFilter({ status }: GetAllCenterOfCostByFilterParams): Observable<CenterOfCost[]> {
    return this.http.get(`${environment.apiUrl}/${this.route}/status/${status}`) as Observable<CenterOfCost[]>;
  };
};