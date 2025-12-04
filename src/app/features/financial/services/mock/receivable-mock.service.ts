import { PllID, PllMockRestService, PllPaginatedResponse, PllRecordRepository, PllRecordState } from "@pollaris";
import { Receivable, ReceivableStatus } from "../../models/receivable.model";
import { ReceivableViewParams, ReceivableViewResponse, ReceivableService } from "../receivable.service";
import { delay, map, Observable, of, switchMap, throwError } from "rxjs";
import { inject, Injectable } from "@angular/core";
import moment from "moment";
import { CenterOfCostMockRepository } from "./center-of-cost-mock.service";
import { PlanOfAccountMockRepository } from "./plan-of-account-mock.service";
import { SecrecyMockRepository } from "./secrecy-mock.service";
import { BankAccountMockRepository } from "./bank-account-mock.service";
import { event, EventObs } from "../../../../common/directives/base-form-component.directive";
import { HttpErrorResponse } from "@angular/common/http";

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

  protected override $evGet: EventObs<Receivable, Receivable> = event(map(record => ({ ...record, status: this._transformStatus(record) })));
  
  override $evInitPost: EventObs<Receivable> = event(
    switchMap(response => this.$recordValidations(response)),
    map(receivable =>({ ...receivable, docNumber: (this.repository.state.data().length + 420).toString().padStart(10, "0"), sequence: this.repository.state.data().length + 1 })),
  );

  override $evInitPut: EventObs<Receivable> = event(
    switchMap(response => this.$recordValidations(response)),
  );

  $recordValidations(record: Receivable): Observable<Receivable> {
    return of(record).pipe(
      switchMap(response => {
        if(moment(response.createdAt).isAfter(response.dueAt, "D")) return throwError(() => new HttpErrorResponse({ status: 422, error: new Error("A data de emissão não pode ser posterior à data de vencimento!") }));
        return of(response);
      }),
    );
  };

  getAllByFilter(params: ReceivableViewParams): Observable<PllPaginatedResponse<ReceivableViewResponse>> {
    const yesterday = moment().subtract(1, "day").toDate();
    return this.repository.$find({
      centerOfCostId: params.centerOfCostId || undefined,
      planOfAccountId: params.planOfAccountId || undefined,
      secrecyId: params.secrecyId || undefined,
      bankAccountId: params.bankAccountId || undefined,
      $or: [
        { $and: [{ paidAt: { $ne: null }}, { paidAt: { $gte: params.startsAt, $lte: params.endsAt } }] },
        { $and: [{ cancelledAt: { $ne: null }}, { cancelledAt: { $gte: params.startsAt, $lte: params.endsAt } }] },
        { $and: [{ paidAt: { $eq: null }, cancelledAt: { $eq: null } }, { createdAt: { $gte: params.startsAt, $lte: params.endsAt } }] },
      ],
      ...(params?.status === "PAID"? { paidAt: { $ne: null } } : {}),
      ...(params?.status === "CANCELLED"? { cancelledAt: { $ne: null } } : {}),
      ...(params?.status === "PENDING"? { paidAt: { $eq: null }, cancelledAt: { $eq: null }, dueAt: { $gte: yesterday } } : {}),
      ...(params?.status === "OVERDUE"? { paidAt: { $eq: null }, cancelledAt: { $eq: null }, dueAt: { $lt: yesterday } } : {}),
      ...(params?.status === "TOPAY"? { paidAt: { $eq: null }, cancelledAt: { $eq: null } } : {}),
    }).pipe(
      delay(this.delay()),
      map(response => ({ ...response, data: this.merge<Receivable, ReceivableViewResponse>(response.data, record => ({
        centerOfCost: this.centerOfCostMockRepository.state.get(record.centerOfCostId)?.name || "",
        planOfAccount: this.planOfAccountMockRepository.state.get(record.planOfAccountId)?.name || "",
        secrecy: this.secrecyMockRepository.state.get(record.secrecyId)?.name || "",
        bankAccount: this.bankAccountMockRepository.state.get(record.bankAccountId)?.name || "",
        status: this._transformStatus(record),
      }))})),
    );
  };

  pay(id: PllID): Observable<Receivable> {
    return this.get(id).pipe(switchMap(response => this.put({ ...response, paidAt: new Date() })));
  };

  cancel(id: PllID): Observable<Receivable> {
    return this.get(id).pipe(switchMap(response => this.put({ ...response, cancelledAt: new Date(), paidAt: null })));
  };

  reopen(id: PllID): Observable<Receivable> {
    return this.get(id).pipe(switchMap(response => this.put({ ...response, cancelledAt: null, paidAt: null })));
  };

  private _transformStatus(record: Receivable): ReceivableStatus {
    if(record.paidAt) return "PAID";
    if(record.cancelledAt) return "CANCELLED";
    return moment().subtract(1, "day").isBefore(record.dueAt, "D")? "PENDING" : "OVERDUE";
  };
};