import { PllID, PllRestService } from "@pollaris";
import { Payable, PayableStatus } from "../models/payable.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import moment from "moment";
import { Injectable } from "@angular/core";

export type GetAllPayableByFilterParams = {
  status?: PayableStatus | "TOPAY" | "ALL";
  centerOfCostId?: PllID | null;
  planOfAccountId?: PllID | null;
  secrecyId?: PllID | null;
  startsAt: Date;
  endsAt: Date;
};

export type GetAllPayableByFilterResponse = Payable & {
  centerOfCost: string;
  planOfAccount: string;
  secrecy: string;
};

@Injectable()
export class PayableService extends PllRestService<Payable> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "payable";

  getAllByFilter({ status, centerOfCostId, planOfAccountId, secrecyId, startsAt, endsAt }: GetAllPayableByFilterParams): Observable<GetAllPayableByFilterResponse[]> {
    return this.http.get<GetAllPayableByFilterResponse[]>(`${this.baseRoute}/${this.pathRoute}`, { params: {
      status,
      centerOfCostId,
      planOfAccountId,
      secrecyId,
      startsAt: moment(startsAt).format("YYYY-MM-DD"),
      endsAt: moment(endsAt).format("YYYY-MM-DD"),
    }});
  };

  pay(id: PllID): Observable<Payable> {
    return this.http.post<Payable>(`${this.baseRoute}/${this.pathRoute}/${id}/pay`, {});
  };

  cancel(id: PllID): Observable<Payable> {
    return this.http.post<Payable>(`${this.baseRoute}/${this.pathRoute}/${id}/cancel`, {});
  };

  reopen(id: PllID): Observable<Payable> {
    return this.http.post<Payable>(`${this.baseRoute}/${this.pathRoute}/${id}/reopen`, {});
  };
};