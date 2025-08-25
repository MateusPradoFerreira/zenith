import { PllMockedRestService, PllPaginatedResponse } from "@pollaris";
import { CashFlow } from "../models/cash-flow.model";
import { GetAllCashFlowByFilterParams, GetAllCashFlowByFilterResponse, CashFlowService } from "./cash-flow.service";
import { delay, map, Observable, of } from "rxjs";
import { fakerJs } from "../../../core/config/faker.config";
import { v4 as uuid } from 'uuid';
import { inject } from "@angular/core";
import { PayableService } from "./payable.service";
import { ReceivableService } from "./receivable.service";
import moment from "moment";
import { BankAccountService } from "./bank-account.service";

export function createMockedCashFlow(data: Partial<CashFlow>): CashFlow {
  return new CashFlow({
    ...data,
    id: data.id || uuid(),
  });
};

export class CashFlowMockedService extends PllMockedRestService<CashFlow> implements CashFlowService {
  payableService = inject(PayableService);
  receivableService = inject(ReceivableService);
  bankAccountService = inject(BankAccountService);

  override createRecord = (data: Partial<CashFlow>) => createMockedCashFlow(data);

  getAllByFilter(params: GetAllCashFlowByFilterParams): Observable<PllPaginatedResponse<GetAllCashFlowByFilterResponse>> {
    return of(this._filtering(params)).pipe(delay(fakerJs.helpers.rangeToNumber({ min: 100, max: 500 }))).pipe(map(response => ({
      data: response,
      pagination: {
        page: 1,
      },
    })));
  };

  private _filtering(params: GetAllCashFlowByFilterParams): CashFlow[] {
    const flow: CashFlow[] = [];

    const start = moment().set("year", 1990).startOf("year");
    const periodStart = moment().set("year", params.year).startOf("year");
    const periodEnd = moment().set("year", params.year).endOf("year");
    const periods: { startsAt: Date, endsAt: Date }[] = [];
    const periodRange = 11;

    for (let i = 0; i <= periodRange; i++) periods.push({ 
      startsAt: moment(periodStart).add(i, "months").startOf("month").toDate(),
      endsAt: moment(periodStart).add(i, "months").endOf("month").toDate(),
    });

    const normalize = (value: any) => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const payables = this.payableService.records().filter(record => record.status === "PAID" && (!params?.query? true : normalize(record.name).includes(normalize(params.query))));
    const receivables = this.receivableService.records().filter(record => record.status === "PAID" && (!params?.query? true : normalize(record.name).includes(normalize(params.query))));

    const formatedPeriods: CashFlow = {
      id: null,
      name: "",
      values: periods.map(period => period.startsAt),
      children: null,
      type: "MARK",
    };

    const openingBalance: CashFlow = {
      id: null,
      name: "Saldo Anterior",
      values: periods.map(period => {
        const payableTotal = payables.filter(payable => moment(payable.paidAt).isBetween(start, moment(period.endsAt).startOf("month").subtract(1, "day"))).reduce((prev, crr) => prev + crr.value, 0);
        const receivableTotal = receivables.filter(receivable => moment(receivable.paidAt).isBetween(start, moment(period.endsAt).subtract(1, "month"))).reduce((prev, crr) => prev + crr.value, 0);
        return receivableTotal - payableTotal;
      }),
      children: null,
      type: "MARK",
    };

    const finalBalance: CashFlow = {
      id: null,
      name: "Saldo Final",
      values: periods.map(period => {
        const payableTotal = payables.filter(payable => moment(payable.paidAt).isBetween(start, period.endsAt)).reduce((prev, crr) => prev + crr.value, 0);
        const receivableTotal = receivables.filter(receivable => moment(receivable.paidAt).isBetween(start, period.endsAt)).reduce((prev, crr) => prev + crr.value, 0);
        return receivableTotal - payableTotal;
      }),
      children: null,
      type: "MARK",
    };

    const payableBankAccountsBalance: CashFlow[] = this.bankAccountService.records().map(bank => ({
      id: bank.id,
      name: `--- ${bank.name}`,
      values: periods.map(period => payables.filter(payable => payable.bankAccountId === bank.id && moment(payable.paidAt).isBetween(period.startsAt, period.endsAt)).reduce((prev, crr) => prev + crr.value, 0) * -1),
      children: payables.sort((a, b) => new Date(a.paidAt).getTime() - new Date(b.paidAt).getTime()).filter(payable => payable.bankAccountId === bank.id && moment(payable.paidAt).isBetween(periodStart, periodEnd)).map(payable => ({
        id: payable.id,
        name: `----- ${payable.name}`,
        values: periods.map(period => moment(payable.paidAt).isBetween(period.startsAt, period.endsAt)? payable.value : 0),
        children: null,
        type: "PAYABLE",
      } as CashFlow)),
      type: "BANK",
    } as CashFlow));

    const payableBalance: CashFlow = {
      id: null,
      name: "Despesas",
      values: periods.map(period => payables.filter(payable => moment(payable.paidAt).isBetween(period.startsAt, period.endsAt)).reduce((prev, crr) => prev + crr.value, 0) * -1),
      children: payableBankAccountsBalance,
      type: "PAYABLE_MARK",
    };

    const receivableBankAccountsBalance: CashFlow[] = this.bankAccountService.records().map(bank => ({
      id: bank.id,
      name: `--- ${bank.name}`,
      values: periods.map(period => receivables.filter(receivable => receivable.bankAccountId === bank.id && moment(receivable.paidAt).isBetween(period.startsAt, period.endsAt)).reduce((prev, crr) => prev + crr.value, 0)),
      children: receivables.sort((a, b) => new Date(a.paidAt).getTime() - new Date(b.paidAt).getTime()).filter(receivable => receivable.bankAccountId === bank.id && moment(receivable.paidAt).isBetween(periodStart, periodEnd)).map(receivable => ({
        id: receivable.id,
        name: `----- ${receivable.name}`,
        values: periods.map(period => moment(receivable.paidAt).isBetween(period.startsAt, period.endsAt)? receivable.value : 0),
        children: null,
        type: "RECEIVABLE",
      } as CashFlow)),
      type: "BANK",
    }));

    const receivableBalance: CashFlow = {
      id: null,
      name: "Receitas",
      values: periods.map(period => receivables.filter(receivable => moment(receivable.paidAt).isBetween(period.startsAt, period.endsAt)).reduce((prev, crr) => prev + crr.value, 0)),
      children: receivableBankAccountsBalance,
      type: "RECEIVABLE_MARK",
    };

    flow.push(formatedPeriods);
    flow.push(payableBalance);
    flow.push(receivableBalance);
    flow.push(openingBalance);
    flow.push(finalBalance);

    return flow;
  };
};