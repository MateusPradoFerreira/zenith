import { PllID, PllRestService } from "@pollaris";
import { Receivable, ReceivableStatus } from "../models/receivable.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import moment from "moment";
import { Injectable } from "@angular/core";

export type GetAllReceivableByFilterParams = {
  status?: ReceivableStatus | "TOPAY" | "ALL";
  centerOfCostId?: PllID | null;
  planOfAccountId?: PllID | null;
  secrecyId?: PllID | null;
  startsAt: Date;
  endsAt: Date;
};

export type GetAllReceivableByFilterResponse = Receivable & {
  centerOfCost: string;
  planOfAccount: string;
  secrecy: string;
};

@Injectable()
export class ReceivableService extends PllRestService<Receivable> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "receivable";

  getAllByFilter({ status, centerOfCostId, planOfAccountId, secrecyId, startsAt, endsAt }: GetAllReceivableByFilterParams): Observable<GetAllReceivableByFilterResponse[]> {
    return this.http.get<GetAllReceivableByFilterResponse[]>(`${this.baseRoute}/${this.pathRoute}`, { params: {
      status,
      centerOfCostId,
      planOfAccountId,
      secrecyId,
      startsAt: moment(startsAt).format("YYYY-MM-DD"),
      endsAt: moment(endsAt).format("YYYY-MM-DD"),
    }});
  };
};