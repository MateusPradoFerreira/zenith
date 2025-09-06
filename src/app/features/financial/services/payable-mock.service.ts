import { PllID, PllMockRestService, PllPaginatedResponse } from "@pollaris";
import { Payable } from "../models/payable.model";
import { GetAllPayableByFilterParams, GetAllPayableByFilterResponse, PayableService } from "./payable.service";
import { delay, map, Observable, of, switchMap } from "rxjs";
import { fakerJs } from "../../../core/config/faker.config";
import { inject } from "@angular/core";
import moment from "moment";
import { v4 as uuid } from 'uuid';
import { INITIAL_SECRECY_MOCKED_DATA } from "./secrecy-mock.service";
import { SecrecyService } from "./secrecy.service";
import { INITIAL_PLAN_OF_ACCOUNT_MOCKED_DATA } from "./plan-of-account-mock.service";
import { PlanOfAccountService } from "./plan-of-account.service";
import { INITIAL_CENTER_OF_COST_MOCKED_DATA } from "./center-of-cost-mock.service";
import { CenterOfCostService } from "./center-of-cost.service";
import { INITIAL_BANK_ACCOUNT_MOCKED_DATA } from "./bank-account-mock.service";
import { BankAccountService } from "./bank-account.service";
import { Util } from "../../../common/util/util";

export function createMockedPayable(data: Partial<Payable>): Payable {
  const status = data?.status || fakerJs.helpers.arrayElement(["PENDING", "PAID", "OVERDUE", "CANCELLED"]);
  const createdAt = data?.createdAt || fakerJs.date.between({ from: moment().startOf("month").toDate(), to: moment().endOf("month").toDate() });
  const paidAt = data?.paidAt || status !== "PAID"? null : fakerJs.date.between({ from: createdAt, to: moment(createdAt).add(1, "month").toDate() });
  const cancelledAt = data?.cancelledAt || status !== "CANCELLED"? null : fakerJs.date.between({ from: createdAt, to: moment(createdAt).add(1, "month").toDate() });

  return new Payable({
    name: "New Payable",
    status,
    dueAt: createdAt,
    paidAt,
    createdAt,
    cancelledAt,
    value: fakerJs.number.float({ min: 10, max: 200, fractionDigits: 2 }),
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

export class PayableMockService extends PllMockRestService<Payable> implements PayableService {
  secrecyService = inject(SecrecyService);
  centerOfCostService = inject(CenterOfCostService);
  planOfAccountService = inject(PlanOfAccountService);
  bankAccountService = inject(BankAccountService);

  constructor () {
    super([
      ...Util.buildMonths(7).map(date => createMockedPayable({ name: "Conta de Luz", createdAt: date, status: moment(date).isBefore()? "PAID" : "PENDING" })),
      ...Util.buildMonths(7).map(date => createMockedPayable({ name: "Conta de Água", createdAt: date, status: moment(date).isBefore()? "PAID" : "PENDING" })),
      ...Util.buildMonths(10).map(date => createMockedPayable({ name: "Internet", value: 139, createdAt: date, status: moment(date).isBefore()? "PAID" : "PENDING" })),
      ...Util.buildMonths(12).map(date => createMockedPayable({ name: "Aluguel", value: 600, createdAt: date, status: moment(date).isBefore()? "PAID" : "PENDING" })),
      ...Util.buildMonths(2).map(date => createMockedPayable({ name: "Mensalidade Academia", value: 160, createdAt: date, status: moment(date).isBefore()? "PAID" : "PENDING" })),
      ...Util.buildMonths(10).map(date => createMockedPayable({ name: "Plano de Saúde", value: 200, createdAt: date, status: moment(date).isBefore()? "PAID" : "PENDING" })),
      ...Util.buildMonths(12).map(date => createMockedPayable({ name: "Serviço de Streaming", value: 20, createdAt: date, status: moment(date).isBefore()? "PAID" : "PENDING" })),
      ...Util.buildMonths(2).map(date => createMockedPayable({ name: "Mercado", value: 700, createdAt: date, status: moment(date).isBefore()? "PAID" : "PENDING" })),
      ...Util.buildMonths(14).map(date => createMockedPayable({ name: "Financiamento", value: 1000, createdAt: date, status: moment(date).isBefore()? "PAID" : "PENDING" })),
    ]);
  };

  override createRecord = (data: Partial<Payable>) => {
    const sequence = this.records().length + 1;
    const docNumber = (this.records().length + 1).toString().padStart(10, "0");
    return createMockedPayable({ ...data, sequence, docNumber });
  };

  getAllByFilter(params: GetAllPayableByFilterParams): Observable<PllPaginatedResponse<GetAllPayableByFilterResponse>> {
    return of(this._filtering(this.records(), params)).pipe(
      delay(fakerJs.helpers.rangeToNumber({ min: 100, max: 500 })),
      map(records => records.map(record => {
        const newRecord: GetAllPayableByFilterResponse = {
          ...record,
          centerOfCost: this.centerOfCostService.records().find(centerOfCost => centerOfCost.id === record.centerOfCostId).name,
          planOfAccount: this.planOfAccountService.records().find(planOfAccount => planOfAccount.id === record.planOfAccountId).name,
          secrecy: this.secrecyService.records().find(secrecy => secrecy.id === record.secrecyId).name,
          bankAccount: this.bankAccountService.records().find(bankAccount => bankAccount.id === record.bankAccountId).name,
        };
        return newRecord;
      })),
    ).pipe(map(response => ({
      data: response,
      pagination: {
        page: 1,
      },
    })));
  };

  private _filtering(records: Payable[], params: GetAllPayableByFilterParams): Payable[] {
    records = records.filter(record => !params.status || params.status === "ALL"? true : params.status === "TOPAY"? ["PENDING", "OVERDUE"].includes(record.status) : record.status === params.status);
    records = records.filter(record => !params.centerOfCostId? true : record.centerOfCostId === params.centerOfCostId);
    records = records.filter(record => !params.planOfAccountId? true : record.planOfAccountId === params.planOfAccountId);
    records = records.filter(record => !params.secrecyId? true : record.secrecyId === params.secrecyId);
    records = records.filter(record => !params.bankAccountId? true : record.bankAccountId === params.bankAccountId);
    return records.filter(record => moment(record.status === "PAID"? record.paidAt : record.status === "OVERDUE"? record.dueAt : record.status === "CANCELLED"? record.cancelledAt : record.createdAt).isBetween(params.startsAt, params.endsAt, "day", "[]"));
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