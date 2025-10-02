import { PllID, PllMockRestService, PllPaginatedResponse, PllRecordRepository, PllRecordState } from "@pollaris";
import { Payable } from "../../models/payable.model";
import { GetAllPayableByFilterParams, GetAllPayableByFilterResponse, PayableService } from "../payable.service";
import { delay, map, Observable, switchMap } from "rxjs";
import { inject, Injectable } from "@angular/core";
import moment from "moment";
import { CenterOfCostMockRepository } from "./center-of-cost-mock.service";
import { PlanOfAccountMockRepository } from "./plan-of-account-mock.service";
import { SecrecyMockRepository } from "./secrecy-mock.service";
import { BankAccountMockRepository } from "./bank-account-mock.service";

@Injectable({ providedIn: "root" })
export class PayableMockState extends PllRecordState<Payable> {};

@Injectable({ providedIn: "root" })
export class PayableMockRepository extends PllRecordRepository<Payable> {
  override state = inject(PayableMockState);
};

export class PayableMockService extends PllMockRestService<Payable> implements PayableService {
  override repository = inject(PayableMockRepository);

  centerOfCostMockRepository = inject(CenterOfCostMockRepository);
  planOfAccountMockRepository = inject(PlanOfAccountMockRepository);
  secrecyMockRepository = inject(SecrecyMockRepository);
  bankAccountMockRepository = inject(BankAccountMockRepository);

  getAllByFilter(params: GetAllPayableByFilterParams): Observable<PllPaginatedResponse<GetAllPayableByFilterResponse>> {
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
      map(response => ({ ...response, data: this.merge<Payable, GetAllPayableByFilterResponse>(response.data, record => ({
        centerOfCost: this.centerOfCostMockRepository.state.get(record.centerOfCostId)?.name || "",
        planOfAccount: this.planOfAccountMockRepository.state.get(record.centerOfCostId)?.name || "",
        secrecy: this.secrecyMockRepository.state.get(record.centerOfCostId)?.name || "",
        bankAccount: this.bankAccountMockRepository.state.get(record.centerOfCostId)?.name || "",
      }))})),
    );
  };

  pay(id: PllID): Observable<Payable> {
    return this.get(id).pipe(switchMap(response => this.put({ ...response, paidAt: new Date(), status: "PAID" })));
  };

  cancel(id: PllID): Observable<Payable> {
    return this.get(id).pipe(switchMap(response => this.put({ ...response, cancelledAt: new Date(), status: "CANCELLED" })));
  };

  reopen(id: PllID): Observable<Payable> {
    return this.get(id).pipe(switchMap(response => this.put({ ...response, cancelledAt: null, paidAt: null, status: moment().isAfter(response.dueAt)? "OVERDUE" : "PENDING" })));
  };
};