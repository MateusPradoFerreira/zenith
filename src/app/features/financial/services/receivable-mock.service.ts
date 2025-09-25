import { PllID, PllMockRestService, PllPaginatedResponse } from "@pollaris";
import { Receivable } from "../models/receivable.model";
import { GetAllReceivableByFilterParams, GetAllReceivableByFilterResponse, ReceivableService } from "./receivable.service";
import { delay, map, Observable, of, switchMap } from "rxjs";
import { fakerJs } from "../../../core/config/faker.config";
import { inject, Injectable } from "@angular/core";
import moment from "moment";
import { v4 as uuid } from 'uuid';
import { INITIAL_SECRECY_MOCKED_DATA, SecrecyMockService } from "./secrecy-mock.service";
import { INITIAL_PLAN_OF_ACCOUNT_MOCKED_DATA, PlanOfAccountMockService } from "./plan-of-account-mock.service";
import { CenterOfCostMockService, INITIAL_CENTER_OF_COST_MOCKED_DATA } from "./center-of-cost-mock.service";
import { BankAccountMockService, INITIAL_BANK_ACCOUNT_MOCKED_DATA } from "./bank-account-mock.service";
import { Util } from "../../../common/util/util";

export function createMockedReceivable(data: Partial<Receivable>): Receivable {
  const status = data?.status || fakerJs.helpers.arrayElement(["PENDING", "PAID", "OVERDUE", "CANCELLED"]);
  const createdAt = data?.createdAt || fakerJs.date.between({ from: moment().startOf("month").toDate(), to: moment().endOf("month").toDate() });
  const paidAt = data?.paidAt || status !== "PAID"? null : fakerJs.date.between({ from: createdAt, to: moment(createdAt).add(1, "month").toDate() });
  const cancelledAt = data?.cancelledAt || status !== "CANCELLED"? null : fakerJs.date.between({ from: createdAt, to: moment(createdAt).add(1, "month").toDate() });

  return new Receivable({
    name: "New Receivable",
    status,
    dueAt: createdAt,
    paidAt,
    createdAt,
    cancelledAt,
    value: fakerJs.number.float({ min: 200, max: 300, fractionDigits: 2 }),
    description: fakerJs.finance.transactionDescription(),
    active: true,
    secrecyId: fakerJs.helpers.arrayElement(INITIAL_SECRECY_MOCKED_DATA).id,
    centerOfCostId: fakerJs.helpers.arrayElement(INITIAL_CENTER_OF_COST_MOCKED_DATA).id,
    planOfAccountId: fakerJs.helpers.arrayElement(INITIAL_PLAN_OF_ACCOUNT_MOCKED_DATA).id,
    bankAccountId: fakerJs.helpers.arrayElement(INITIAL_BANK_ACCOUNT_MOCKED_DATA).id,
    docNumber: "0000000000",
    sequence: 0,
    ...data,
    id: data.id || uuid(),
  });
};

@Injectable({ providedIn: "root" })
export class ReceivableMockService extends PllMockRestService<Receivable> implements ReceivableService {
  secrecyMockService = inject(SecrecyMockService);
  centerOfCostMockService = inject(CenterOfCostMockService);
  planOfAccountMockService = inject(PlanOfAccountMockService);
  bankAccountMockService = inject(BankAccountMockService);

  constructor () {
    super([
      ...Util.buildMonths(1).map(date => createMockedReceivable({ name: "Salário", createdAt: date, value: 3557, status: moment(date).isBefore()? "PAID" : "PENDING" })),
      ...Util.buildMonths(8).map(date => createMockedReceivable({ name: "Freelance - Projeto Web", createdAt: date, status: moment(date).isBefore()? "PAID" : "PENDING" })),
      ...Util.buildMonths(9).map(date => createMockedReceivable({ name: "Aluguel Recebido", createdAt: date, value: 400, status: moment(date).isBefore()? "PAID" : "PENDING" })),
      ...Util.buildMonths(2).map((date, index) => createMockedReceivable({ name: "Juros de Investimento", createdAt: date, value: 40 + (!index? 0 : index * 0.6), status: moment(date).isBefore()? "PAID" : "PENDING" })),
    ]);
  };

  override createRecord = (data: Partial<Receivable>) => {
    const sequence = this.records().length + 1;
    const docNumber = (this.records().length + 1).toString().padStart(10, "0");
    return createMockedReceivable({ ...data, sequence, docNumber });
  };

  getAllByFilter(params: GetAllReceivableByFilterParams): Observable<PllPaginatedResponse<GetAllReceivableByFilterResponse>> {
    return of(this._filtering(this.records(), params)).pipe(
      delay(fakerJs.helpers.rangeToNumber({ min: 100, max: 500 })),
      map(records => records.map(record => {
        const newRecord: GetAllReceivableByFilterResponse = {
          ...record,
          centerOfCost: this.centerOfCostMockService.records().find(centerOfCost => centerOfCost.id === record.centerOfCostId).name,
          planOfAccount: this.planOfAccountMockService.records().find(planOfAccount => planOfAccount.id === record.planOfAccountId).name,
          secrecy: this.secrecyMockService.records().find(secrecy => secrecy.id === record.secrecyId).name,
          bankAccount: this.bankAccountMockService.records().find(bankAccount => bankAccount.id === record.bankAccountId).name,
        };
        return newRecord;
      })),
      map(response => Util.paginatedValueFrom(response)),
    );
  };

  private _filtering(records: Receivable[], params: GetAllReceivableByFilterParams): Receivable[] {
    records = records.filter(record => !params.status || params.status === "ALL"? true : params.status === "TOPAY"? ["PENDING", "OVERDUE"].includes(record.status) : record.status === params.status);
    records = records.filter(record => !params.centerOfCostId? true : record.centerOfCostId === params.centerOfCostId);
    records = records.filter(record => !params.planOfAccountId? true : record.planOfAccountId === params.planOfAccountId);
    records = records.filter(record => !params.secrecyId? true : record.secrecyId === params.secrecyId);
    records = records.filter(record => !params.bankAccountId? true : record.bankAccountId === params.bankAccountId);
    return records.filter(record => moment(record.status === "PAID"? record.paidAt : record.status === "OVERDUE"? record.dueAt : record.status === "CANCELLED"? record.cancelledAt : record.createdAt).isBetween(params.startsAt, params.endsAt, "day", "[]"));
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