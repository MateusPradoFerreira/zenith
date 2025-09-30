import { PllPaginatedResponse, PllRestService } from "@pollaris";
import { Secrecy } from "../models/secrecy.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type GetAllSecrecyByFilterParams = {
  status?: "ACTIVE" | "INACTIVE" | "ALL";
};

@Injectable()
export class SecrecyService extends PllRestService<Secrecy> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "secrecy";

  getAllByFilter({ status }: GetAllSecrecyByFilterParams): Observable<PllPaginatedResponse<Secrecy>> {
    return this.http.get<PllPaginatedResponse<Secrecy>>(`${this.baseRoute}/${this.pathRoute}`, { params: {
      status,
    }});
  };
};