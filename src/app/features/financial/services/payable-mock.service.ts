import { PllID, PllMockRestService, PllPaginatedResponse, PllRecordRepository, PllRecordState } from "@pollaris";
import { Payable, PayableStatus } from "../models/payable.model";
import { GetAllPayableByFilterParams, GetAllPayableByFilterResponse, PayableService } from "./payable.service";
import { delay, map, Observable, of, switchMap } from "rxjs";
import { inject, Injectable } from "@angular/core";
import moment from "moment";

@Injectable({ providedIn: "root" })
export class PayableMockState extends PllRecordState<Payable> {};

@Injectable({ providedIn: "root" })
export class PayableMockRepository extends PllRecordRepository<Payable> {
  override state = inject(PayableMockState);
};

export class PayableMockService extends PllMockRestService<Payable> implements PayableService {
  override repository = inject(PayableMockRepository);

  getAllByFilter(params: GetAllPayableByFilterParams): Observable<PllPaginatedResponse<GetAllPayableByFilterResponse>> {
    return this.repository.find({
      ...(!params?.centerOfCostId? {} : { centerOfCostId: params.centerOfCostId }),
      ...(!params?.planOfAccountId? {} : { planOfAccountId: params.planOfAccountId }),
      ...(!params?.secrecyId? {} : { secrecyId: params.secrecyId }),
      ...(!params?.bankAccountId? {} : { bankAccountId: params.bankAccountId }),
      ...(!params?.status || params.status === "ALL"? {} : params.status === "TOPAY" ? { $or: [{ status: "PENDING" }, { status: "OVERDUE" }]} : { status: params.status }),
    }).pipe(
      delay(this.delay()),
      map(response => ({ ...response, data: this.mergeData<Payable, GetAllPayableByFilterResponse>(response.data, () => ({
        centerOfCost: "",
        planOfAccount: "",
        secrecy: "",
        bankAccount: "",
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