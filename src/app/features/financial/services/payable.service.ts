import { PllID, PllPaginatedResponse, PllRestService } from "@pollaris";
import { Payable, PayableStatus } from "../models/payable.model";
import { map, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import moment from "moment";
import { Injectable } from "@angular/core";

export type GetAllPayableByFilterParams = {
  status?: PayableStatus | "TOPAY" | "ALL";
  centerOfCostId?: PllID | null;
  planOfAccountId?: PllID | null;
  secrecyId?: PllID | null;
  bankAccountId?: PllID | null;
  startsAt: Date;
  endsAt: Date;
};

export type GetAllPayableByFilterResponse = Payable & {
  bankAccount: string;
  centerOfCost: string;
  planOfAccount: string;
  secrecy: string;
};

@Injectable()
export class PayableService extends PllRestService<Payable> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "payables";

  getAllByFilter({ startsAt, endsAt, ...params }: GetAllPayableByFilterParams): Observable<PllPaginatedResponse<GetAllPayableByFilterResponse>> {
    return this.http.get<GetAllPayableByFilterResponse[]>(`${this.baseRoute}/${this.pathRoute}/startsAt/${moment(startsAt).format("YYYY-MM-DD")}/endsAt/${moment(endsAt).format("YYYY-MM-DD")}`, { 
      params 
    }).pipe(map(response => ({ data: response, pagination: { page: 1, size: 100, sort: "ASC", total: response.length }})));
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