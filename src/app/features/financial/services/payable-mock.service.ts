import { PllID, PllMockedRestService } from "@pollaris";
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

export function createMokedPayable(data: Partial<Payable>): Payable {
  const status = fakerJs.helpers.arrayElement(["PENDING", "PAID", "OVERDUE", "CANCELLED"]);
  const createdAt = fakerJs.date.between({ from: moment().startOf("month").toDate(), to: moment().endOf("month").toDate() });
  const paidAt = status !== "PAID"? null : fakerJs.date.between({ from: createdAt, to: moment(createdAt).add(1, "month").toDate() });
  const cancelledAt = status !== "CANCELLED"? null : fakerJs.date.between({ from: createdAt, to: moment(createdAt).add(1, "month").toDate() });

  return new Payable({
    name: "New Payable",
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
    docNumber: "0000000000",
    ...data,
    id: data.id || uuid(),
  });
};

export class PayableMockedService extends PllMockedRestService<Payable> implements PayableService {
  secrecyService = inject(SecrecyService);
  centerOfCostService = inject(CenterOfCostService);
  planOfAccountService = inject(PlanOfAccountService);

  constructor () {
    super([
      createMokedPayable({ name: "Conta de Luz", docNumber: "0000000001", sequence: 1 }),
      createMokedPayable({ name: "Conta de Água", docNumber: "0000000002", sequence: 2 }),
      createMokedPayable({ name: "Internet", docNumber: "0000000003", sequence: 3 }),
      createMokedPayable({ name: "Aluguel", docNumber: "0000000004", sequence: 4 }),
      createMokedPayable({ name: "Telefone", docNumber: "0000000005", sequence: 5 }),
      createMokedPayable({ name: "Mensalidade Academia", docNumber: "0000000006", sequence: 6 }),
      createMokedPayable({ name: "Plano de Saúde", docNumber: "0000000007", sequence: 7 }),
      createMokedPayable({ name: "Serviço de Streaming", docNumber: "0000000008", sequence: 8 }),
      createMokedPayable({ name: "Manutenção Veículo", docNumber: "0000000009", sequence: 9 }),
      createMokedPayable({ name: "Compras Escritório", docNumber: "0000000010", sequence: 10 }),
    ]);
  };

  override createRecord = (data: Partial<Payable>) => {
    const sequence = this.records().length + 1;
    const docNumber = (this.records().length + 1).toString().padStart(10, "0");
    return createMokedPayable({ ...data, sequence, docNumber });
  };

  getAllByFilter(params: GetAllPayableByFilterParams): Observable<GetAllPayableByFilterResponse[]> {
    return of(this._filtering(this.records(), params)).pipe(
      delay(fakerJs.helpers.rangeToNumber({ min: 100, max: 500 })),
      map(records => records.map(record => {
        const newRecord: GetAllPayableByFilterResponse = {
          ...record,
          centerOfCost: this.centerOfCostService.records().find(centerOfCost => centerOfCost.id === record.centerOfCostId).name,
          planOfAccount: this.planOfAccountService.records().find(planOfAccount => planOfAccount.id === record.planOfAccountId).name,
          secrecy: this.secrecyService.records().find(secrecy => secrecy.id === record.secrecyId).name,
        };
        return newRecord;
      })),
    );
  };

  private _filtering(records: Payable[], params: GetAllPayableByFilterParams): Payable[] {
    records = records.filter(record => !params.status || params.status === "ALL"? true : params.status === "TOPAY"? ["PENDING", "OVERDUE"].includes(record.status) : record.status === params.status);
    records = records.filter(record => !params.centerOfCostId? true : record.centerOfCostId === params.centerOfCostId);
    records = records.filter(record => !params.planOfAccountId? true : record.planOfAccountId === params.planOfAccountId);
    records = records.filter(record => !params.secrecyId? true : record.secrecyId === params.secrecyId);
    return records.filter(record => moment(record.status === "PAID"? record.paidAt : record.status === "OVERDUE"? record.dueAt : record.status === "CANCELLED"? record.cancelledAt : record.createdAt).isBetween(params.startsAt, params.endsAt));
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