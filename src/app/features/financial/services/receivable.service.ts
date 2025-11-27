import { PllID, PllPaginatedResponse, PllRestService } from "@pollaris";
import { Receivable, ReceivableStatus } from "../models/receivable.model";
import { map, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import moment from "moment";
import { Injectable } from "@angular/core";

export type GetAllReceivableByFilterParams = {
  status?: ReceivableStatus | "TOPAY" | "ALL";
  centerOfCostId?: PllID | null;
  planOfAccountId?: PllID | null;
  secrecyId?: PllID | null;
  bankAccountId?: PllID | null;
  startsAt: Date;
  endsAt: Date;
};

export type GetAllReceivableByFilterResponse = Receivable & {
  bankAccount: string;
  centerOfCost: string;
  planOfAccount: string;
  secrecy: string;
};

@Injectable()
export class ReceivableService extends PllRestService<Receivable> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "receivables";

  getAllByFilter({ startsAt, endsAt, ...params }: GetAllReceivableByFilterParams): Observable<PllPaginatedResponse<GetAllReceivableByFilterResponse>> {
    return this.http.get<GetAllReceivableByFilterResponse[]>(`${this.baseRoute}/${this.pathRoute}/startsAt/${moment(startsAt).format("YYYY-MM-DD")}/endsAt/${moment(endsAt).format("YYYY-MM-DD")}`, { 
      params 
    }).pipe(map(response => ({ data: response, pagination: { page: 1, size: 100, sort: "ASC", total: response.length }})));
  };

  pay(id: PllID): Observable<Receivable> {
    return this.http.post<Receivable>(`${this.baseRoute}/${this.pathRoute}/${id}/pay`, {});
  };

  cancel(id: PllID): Observable<Receivable> {
    return this.http.post<Receivable>(`${this.baseRoute}/${this.pathRoute}/${id}/cancel`, {});
  };

  reopen(id: PllID): Observable<Receivable> {
    return this.http.post<Receivable>(`${this.baseRoute}/${this.pathRoute}/${id}/reopen`, {});
  };
};