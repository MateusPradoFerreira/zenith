import { PllMockRestService, PllPaginatedResponse, PllRecordRepository, PllRecordState } from "@pollaris";
import { BankAccount } from "../models/bank-account.model";
import { GetAllBankAccountByFilterParams, GetAllBankAccountByFilterResponse, BankAccountService } from "./bank-account.service";
import { delay, Observable } from "rxjs";
import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class BankAccountMockState extends PllRecordState<BankAccount> {};

@Injectable({ providedIn: "root" })
export class BankAccountMockRepository extends PllRecordRepository<BankAccount> {
  override state = inject(BankAccountMockState);
};

export class BankAccountMockService extends PllMockRestService<BankAccount> implements BankAccountService {
  override repository = inject(BankAccountMockRepository);

  getAllByFilter(params: GetAllBankAccountByFilterParams): Observable<PllPaginatedResponse<GetAllBankAccountByFilterResponse>> {
    return this.repository.find({
      ...(!params?.status || params.status === "ALL"? {} : { active: params.status === "ACTIVE" }),
    }).pipe(delay(this.delay()));
  };
};