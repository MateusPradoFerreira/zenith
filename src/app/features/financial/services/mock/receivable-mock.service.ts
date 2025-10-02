import { PllID, PllMockRestService, PllPaginatedResponse, PllRecordRepository, PllRecordState } from "@pollaris";
import { Receivable } from "../../models/receivable.model";
import { GetAllReceivableByFilterParams, GetAllReceivableByFilterResponse, ReceivableService } from "../receivable.service";
import { delay, map, Observable, switchMap } from "rxjs";
import { inject, Injectable } from "@angular/core";
import moment from "moment";
import { CenterOfCostMockRepository } from "./center-of-cost-mock.service";
import { PlanOfAccountMockRepository } from "./plan-of-account-mock.service";
import { SecrecyMockRepository } from "./secrecy-mock.service";
import { BankAccountMockRepository } from "./bank-account-mock.service";

@Injectable({ providedIn: "root" })
export class ReceivableMockState extends PllRecordState<Receivable> {};

@Injectable({ providedIn: "root" })
export class ReceivableMockRepository extends PllRecordRepository<Receivable> {
  override state = inject(ReceivableMockState);
};

export class ReceivableMockService extends PllMockRestService<Receivable> implements ReceivableService {
  override repository = inject(ReceivableMockRepository);

  centerOfCostMockRepository = inject(CenterOfCostMockRepository);
  planOfAccountMockRepository = inject(PlanOfAccountMockRepository);
  secrecyMockRepository = inject(SecrecyMockRepository);
  bankAccountMockRepository = inject(BankAccountMockRepository);

  getAllByFilter(params: GetAllReceivableByFilterParams): Observable<PllPaginatedResponse<GetAllReceivableByFilterResponse>> {
    return this.repository.$find({
      centerOfCostId: params.centerOfCostId || undefined,
      planOfAccountId: params.planOfAccountId || undefined,
      secrecyId: params.secrecyId || undefined,
      bankAccountId: params.bankAccountId || undefined,
      status: !params.status || params.status === "ALL"? undefined : params.status === "TOPAY"? { $in: ["PENDING", "OVERDUE"] as any } : params.status,
      $or: [
        { status: "PAID", paidAt: { $gte: params.startsAt, $lte: params.endsAt } },
        { status: "CANCELLED", cancelledAt: { $gte: params.startsAt, $lte: params.endsAt } },
        { status: { $nin: ["PAID", "CANCELLED" ] as any }, createdAt: { $gte: params.startsAt, $lte: params.endsAt } },
      ],
    }).pipe(
      delay(this.delay()),
      map(response => ({ ...response, data: this.merge<Receivable, GetAllReceivableByFilterResponse>(response.data, record => ({
        centerOfCost: this.centerOfCostMockRepository.state.get(record.centerOfCostId)?.name || "",
        planOfAccount: this.planOfAccountMockRepository.state.get(record.centerOfCostId)?.name || "",
        secrecy: this.secrecyMockRepository.state.get(record.centerOfCostId)?.name || "",
        bankAccount: this.bankAccountMockRepository.state.get(record.centerOfCostId)?.name || "",
      }))})),
    );
  };

  pay(id: PllID): Observable<Receivable> {
    return this.get(id).pipe(switchMap(response => this.put({ ...response, paidAt: new Date(), status: "PAID" })));
  };

  cancel(id: PllID): Observable<Receivable> {
    return this.get(id).pipe(switchMap(response => this.put({ ...response, cancelledAt: new Date(), status: "CANCELLED" })));
  };

  reopen(id: PllID): Observable<Receivable> {
    return this.get(id).pipe(switchMap(response => this.put({ ...response, cancelledAt: null, paidAt: null, status: moment().isAfter(response.dueAt)? "OVERDUE" : "PENDING" })));
  };
};