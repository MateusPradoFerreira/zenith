import { Observable } from "rxjs";
import { BaseService } from "../../../core/base/base-service";
import { Secrecy } from "../models/secrecy.model";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type GetAllSecrecyByFilterParams = {
  status: "ALL" | "ACTIVE" | "INACTIVE";
};

@Injectable()
export class SecrecyService extends BaseService<Secrecy> {
  route: string = "secrecy";

  getAllByFilter({ status }: GetAllSecrecyByFilterParams): Observable<Secrecy[]> {
    return this.http.get(`${environment.apiUrl}/${this.route}/status/${status}`) as Observable<Secrecy[]>;
  };
};