import { PllPaginatedResponse, PllRestService } from "@pollaris";
import { Secrecy } from "../models/secrecy.model";
import { map, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type SecrecyViewParams = {
  status?: "ACTIVE" | "INACTIVE" | "ALL";
};

@Injectable()
export class SecrecyService extends PllRestService<Secrecy> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "secrecies";

  getAllByFilter({ status }: SecrecyViewParams): Observable<PllPaginatedResponse<Secrecy>> {
    return this.http.get<Secrecy[]>(`${this.baseRoute}/${this.pathRoute}`, { params: {
      status,
    }}).pipe(map(response => ({ data: response, pagination: { page: 1, size: 100, sort: "ASC", total: response.length }})));
  };
};