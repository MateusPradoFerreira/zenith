import { PllID, PllPaginatedResponse, PllRestService } from "@pollaris";
import { Payable, PayableStatus } from "../models/payable.model";
import { map, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import moment from "moment";
import { Injectable } from "@angular/core";

export type PayableViewParams = {
  status?: PayableStatus | "TOPAY" | "ALL";
  centerOfCostId?: PllID | null;
  planOfAccountId?: PllID | null;
  secrecyId?: PllID | null;
  bankAccountId?: PllID | null;
  startsAt: Date;
  endsAt: Date;
};

export type PayableViewResponse = Payable & {
  bankAccount: string;
  centerOfCost: string;
  planOfAccount: string;
  secrecy: string;
};

@Injectable()
export class PayableService extends PllRestService<Payable> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "payables";

  getAllByFilter({ startsAt, endsAt, ...params }: PayableViewParams): Observable<PllPaginatedResponse<PayableViewResponse>> {
    return this.http.get<PllPaginatedResponse<PayableViewResponse>>(`${this.baseRoute}/${this.pathRoute}/startsAt/${moment(startsAt).format("YYYY-MM-DD")}/endsAt/${moment(endsAt).format("YYYY-MM-DD")}`, { 
      params 
    });
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