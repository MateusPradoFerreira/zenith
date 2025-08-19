import { PllPaginatedResponse, PllRestService } from "@pollaris";
import { BankAccount } from "../models/bank-account.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type GetAllBankAccountByFilterParams = {
  status?: "ACTIVE" | "INACTIVE" | "ALL";
};

export type GetAllBankAccountByFilterResponse = BankAccount;

@Injectable()
export class BankAccountService extends PllRestService<BankAccount> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "bank-account";

  getAllByFilter({ status }: GetAllBankAccountByFilterParams): Observable<PllPaginatedResponse<GetAllBankAccountByFilterResponse>> {
    return this.http.get<PllPaginatedResponse<GetAllBankAccountByFilterResponse>>(`${this.baseRoute}/${this.pathRoute}`, { params: {
      status,
    }});
  };
};