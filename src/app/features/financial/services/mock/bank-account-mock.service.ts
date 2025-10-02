import { PllMockRestService, PllPaginatedResponse, PllRecordRepository, PllRecordState } from "@pollaris";
import { BankAccount } from "../../models/bank-account.model";
import { GetAllBankAccountByFilterParams, BankAccountService } from "../bank-account.service";
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

  getAllByFilter(params: GetAllBankAccountByFilterParams): Observable<PllPaginatedResponse<BankAccount>> {
    return this.repository.$find({
      active: !params.status || params.status === "ALL"? undefined : params.status === "ACTIVE"? true : false,
    }).pipe(delay(this.delay()));
  };
};