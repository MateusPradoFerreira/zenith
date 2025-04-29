import { Observable } from "rxjs";
import { BaseService } from "../../../core/base/base-service";
import { Payable } from "../models/payable.model";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type GetAllPayableByFilterParams = {
  startsAt: Date;
  endsAt: Date;
};

@Injectable()
export class PayableService extends BaseService<Payable> {
  route: string = "payable";

  getAllByFilter({ startsAt, endsAt }: GetAllPayableByFilterParams): Observable<Payable[]> {
    return this.http.get(`${environment.apiUrl}/${this.route}/startsAt/${startsAt}/endsAt/${endsAt}`) as Observable<Payable[]>;
  };
};