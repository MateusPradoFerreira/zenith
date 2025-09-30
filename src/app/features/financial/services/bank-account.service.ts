import { PllPaginatedResponse, PllRestService } from "@pollaris";
import { BankAccount } from "../models/bank-account.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type GetAllBankAccountByFilterParams = {
  status?: "ACTIVE" | "INACTIVE" | "ALL";
};

@Injectable()
export class BankAccountService extends PllRestService<BankAccount> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "bank-account";

  getAllByFilter({ status }: GetAllBankAccountByFilterParams): Observable<PllPaginatedResponse<BankAccount>> {
    return this.http.get<PllPaginatedResponse<BankAccount>>(`${this.baseRoute}/${this.pathRoute}`, { params: {
      status,
    }});
  };
};