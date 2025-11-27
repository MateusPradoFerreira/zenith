import { PllPaginatedResponse, PllRestService } from "@pollaris";
import { BankAccount } from "../models/bank-account.model";
import { map, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type GetAllBankAccountByFilterParams = {
  status?: "ACTIVE" | "INACTIVE" | "ALL";
};

@Injectable()
export class BankAccountService extends PllRestService<BankAccount> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "bank-accounts";

  getAllByFilter({ status }: GetAllBankAccountByFilterParams): Observable<PllPaginatedResponse<BankAccount>> {
    return this.http.get<BankAccount[]>(`${this.baseRoute}/${this.pathRoute}`, { params: {
      status,
    }}).pipe(map(response => ({ data: response, pagination: { page: 1, size: 100, sort: "ASC", total: response.length }})));
  };
};