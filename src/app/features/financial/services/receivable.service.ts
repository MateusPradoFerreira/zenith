import { Observable } from "rxjs";
import { BaseService } from "../../../core/base/base-service";
import { Receivable } from "../models/receivable.model";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type GetAllReceivableByFilterParams = {
  startsAt: Date;
  endsAt: Date;
};

@Injectable()
export class ReceivableService extends BaseService<Receivable> {
  route: string = "payable";

  getAllByFilter({ startsAt, endsAt }: GetAllReceivableByFilterParams): Observable<Receivable[]> {
    return this.http.get(`${environment.apiUrl}/${this.route}/startsAt/${startsAt}/endsAt/${endsAt}`) as Observable<Receivable[]>;
  };
};