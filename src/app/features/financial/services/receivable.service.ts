import { PllID, PllPaginatedResponse, PllRestService } from "@pollaris";
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
  override pathRoute: string = "receivable";

  getAllByFilter({ status, centerOfCostId, planOfAccountId, secrecyId, startsAt, endsAt }: GetAllReceivableByFilterParams): Observable<PllPaginatedResponse<GetAllReceivableByFilterResponse>> {
    return this.http.get<PllPaginatedResponse<GetAllReceivableByFilterResponse>>(`${this.baseRoute}/${this.pathRoute}`, { params: {
      status,
      centerOfCostId,
      planOfAccountId,
      secrecyId,
      startsAt: moment(startsAt).format("YYYY-MM-DD"),
      endsAt: moment(endsAt).format("YYYY-MM-DD"),
    }});
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