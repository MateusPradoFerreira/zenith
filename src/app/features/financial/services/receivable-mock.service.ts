import { PllID, PllMockedRestService } from "@pollaris";
import { Receivable } from "../models/receivable.model";
import { GetAllReceivableByFilterParams, GetAllReceivableByFilterResponse, ReceivableService } from "./receivable.service";
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

export function createMokedReceivable(data: Partial<Receivable>): Receivable {
  const status = fakerJs.helpers.arrayElement(["PENDING", "PAID", "OVERDUE", "CANCELLED"]);
  const createdAt = fakerJs.date.between({ from: moment().startOf("month").toDate(), to: moment().endOf("month").toDate() });
  const paidAt = status !== "PAID"? null : fakerJs.date.between({ from: createdAt, to: moment(createdAt).add(1, "month").toDate() });
  const cancelledAt = status !== "CANCELLED"? null : fakerJs.date.between({ from: createdAt, to: moment(createdAt).add(1, "month").toDate() });

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
    ...data,
    id: data.id || uuid(),
  });
};

export class ReceivableMockedService extends PllMockedRestService<Receivable> implements ReceivableService {
  secrecyService = inject(SecrecyService);
  centerOfCostService = inject(CenterOfCostService);
  planOfAccountService = inject(PlanOfAccountService);
  bankAccountService = inject(BankAccountService);

  constructor () {
    super([
      createMokedReceivable({ name: "Salário", docNumber: "0000000001", value: 3500, sequence: 1 }),
      createMokedReceivable({ name: "Freelance - Projeto Web", docNumber: "0000000002", sequence: 2 }),
      createMokedReceivable({ name: "Aluguel Recebido", docNumber: "0000000004", sequence: 4 }),
      createMokedReceivable({ name: "Reembolso de Despesas", docNumber: "0000000007", sequence: 7 }),
      createMokedReceivable({ name: "Licenciamento de Software", docNumber: "0000000008", sequence: 8 }),
      createMokedReceivable({ name: "Pagamento de Parceria", docNumber: "0000000010", sequence: 10 }),
    ]);
  };

  override createRecord = (data: Partial<Receivable>) => {
    const sequence = this.records().length + 1;
    const docNumber = (this.records().length + 1).toString().padStart(10, "0");
    return createMokedReceivable({ ...data, sequence, docNumber });
  };

  getAllByFilter(params: GetAllReceivableByFilterParams): Observable<GetAllReceivableByFilterResponse[]> {
    return of(this._filtering(this.records(), params)).pipe(
      delay(fakerJs.helpers.rangeToNumber({ min: 100, max: 500 })),
      map(records => records.map(record => {
        const newRecord: GetAllReceivableByFilterResponse = {
          ...record,
          centerOfCost: this.centerOfCostService.records().find(centerOfCost => centerOfCost.id === record.centerOfCostId).name,
          planOfAccount: this.planOfAccountService.records().find(planOfAccount => planOfAccount.id === record.planOfAccountId).name,
          secrecy: this.secrecyService.records().find(secrecy => secrecy.id === record.secrecyId).name,
          bankAccount: this.bankAccountService.records().find(bankAccount => bankAccount.id === record.bankAccountId).name,
        };
        return newRecord;
      })),
    );
  };

  private _filtering(records: Receivable[], params: GetAllReceivableByFilterParams): Receivable[] {
    records = records.filter(record => !params.status || params.status === "ALL"? true : params.status === "TOPAY"? ["PENDING", "OVERDUE"].includes(record.status) : record.status === params.status);
    records = records.filter(record => !params.centerOfCostId? true : record.centerOfCostId === params.centerOfCostId);
    records = records.filter(record => !params.planOfAccountId? true : record.planOfAccountId === params.planOfAccountId);
    records = records.filter(record => !params.secrecyId? true : record.secrecyId === params.secrecyId);
    records = records.filter(record => !params.bankAccountId? true : record.bankAccountId === params.bankAccountId);
    return records.filter(record => moment(record.status === "PAID"? record.paidAt : record.status === "OVERDUE"? record.dueAt : record.status === "CANCELLED"? record.cancelledAt : record.createdAt).isBetween(params.startsAt, params.endsAt));
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