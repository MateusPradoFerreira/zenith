import { PllMockRestService, PllPaginatedResponse, PllRecordRepository, PllRecordState } from "@pollaris";
import { CashFlow } from "../../models/cash-flow.model";
import { GetAllCashFlowByFilterParams, GetAllCashFlowByFilterResponse, CashFlowService } from "../cash-flow.service";
import { Observable, of } from "rxjs";
import { inject, Injectable } from "@angular/core";
import { PayableMockRepository } from "./payable-mock.service";
import { ReceivableMockRepository } from "./receivable-mock.service";
import { BankAccountMockRepository } from "./bank-account-mock.service";
import moment from "moment";

@Injectable({ providedIn: "root" })
export class CashFlowMockState extends PllRecordState<CashFlow> {};

@Injectable({ providedIn: "root" })
export class CashFlowMockRepository extends PllRecordRepository<CashFlow> {
  override state = inject(CashFlowMockState);
};

@Injectable({ providedIn: "root" })
export class CashFlowMockService extends PllMockRestService<CashFlow> implements CashFlowService {
  override repository = inject(CashFlowMockRepository);

  payableMockRepository = inject(PayableMockRepository);
  receivableMockRepository = inject(ReceivableMockRepository);
  bankAccountMockRepository = inject(BankAccountMockRepository);

  getAllByFilter(params: GetAllCashFlowByFilterParams): Observable<PllPaginatedResponse<GetAllCashFlowByFilterResponse>> {
    const flow: CashFlow[] = [];

    const periodStartsAt = moment(params.date).startOf("year");
    const periodEndsAt = moment(params.date).endOf("year");
    const periods: { startsAt: Date, endsAt: Date }[] = [];
    const numberOfMonths = 11;

    for (let i = 0; i <= numberOfMonths; i++) periods.push({ 
      startsAt: moment(periodStartsAt).add(i, "months").startOf("month").toDate(),
      endsAt: moment(periodStartsAt).add(i, "months").endOf("month").toDate(),
    });

    const normalize = (value: any) => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();

    const payables = this.payableMockRepository.find({
      status: "PAID",
      centerOfCostId: params.centerOfCostId || undefined,
      planOfAccountId: params.planOfAccountId || undefined,
      secrecyId: params.secrecyId || undefined,
      bankAccountId: params.bankAccountId || undefined,
      paidAt: { $gte: periodStartsAt.toDate(), $lte: periodEndsAt.toDate() },
      $where: record => normalize(record.name).includes(normalize(params.query || "")),
    }).data;

    const receivables = this.receivableMockRepository.find({
      status: "PAID",
      centerOfCostId: params.centerOfCostId || undefined,
      planOfAccountId: params.planOfAccountId || undefined,
      secrecyId: params.secrecyId || undefined,
      bankAccountId: params.bankAccountId || undefined,
      paidAt: { $gte: periodStartsAt.toDate(), $lte: periodEndsAt.toDate() },
      $where: record => normalize(record.name).includes(normalize(params.query || "")),
    }).data;

    const formatedPeriods: CashFlow = { id: null, name: "", values: periods.map(period => period.startsAt), children: null, type: "MARK" };

    const finalBalance: CashFlow = {
      id: null,
      name: "Saldo Resultante",
      values: periods.map(period => {
        const payableTotal = payables.filter(payable => moment(payable.paidAt).isBetween(period.startsAt, period.endsAt, "day", "[]")).reduce((prev, crr) => prev + crr.value, 0);
        const receivableTotal = receivables.filter(receivable => moment(receivable.paidAt).isBetween(period.startsAt, period.endsAt, "day", "[]")).reduce((prev, crr) => prev + crr.value, 0);
        return receivableTotal - payableTotal;
      }),
      children: null,
      type: "MARK",
    };

    const payableBankAccountsBalance: CashFlow[] = this.bankAccountMockRepository.state.data().filter(record => params?.bankAccountId? record.id === params.bankAccountId : true).map(bank => ({
      id: bank.id,
      name: `--- ${bank.name}`,
      values: periods.map(period => payables.filter(payable => payable.bankAccountId === bank.id && moment(payable.paidAt).isBetween(period.startsAt, period.endsAt, "day", "[]")).reduce((prev, crr) => prev + crr.value, 0) * -1),
      children: payables.sort((a, b) => new Date(a.paidAt).getTime() - new Date(b.paidAt).getTime()).filter(payable => payable.bankAccountId === bank.id && moment(payable.paidAt).isBetween(periodStartsAt, periodEndsAt, "day", "[]")).map(payable => ({
        id: payable.id,
        name: `----- ${payable.name}`,
        values: periods.map(period => moment(payable.paidAt).isBetween(period.startsAt, period.endsAt, "day", "[]")? payable.value : 0),
        children: null,
        type: "PAYABLE",
      } as CashFlow)),
      type: "BANK",
    } as CashFlow));

    const payableBalance: CashFlow = {
      id: null,
      name: "Despesas",
      values: periods.map(period => payables.filter(payable => moment(payable.paidAt).isBetween(period.startsAt, period.endsAt, "day", "[]")).reduce((prev, crr) => prev + crr.value, 0) * -1),
      children: payableBankAccountsBalance,
      type: "PAYABLE_MARK",
    };

    const receivableBankAccountsBalance: CashFlow[] = this.bankAccountMockRepository.state.data().filter(record => params?.bankAccountId? record.id === params.bankAccountId : true).map(bank => ({
      id: bank.id,
      name: `--- ${bank.name}`,
      values: periods.map(period => receivables.filter(receivable => receivable.bankAccountId === bank.id && moment(receivable.paidAt).isBetween(period.startsAt, period.endsAt, "day", "[]")).reduce((prev, crr) => prev + crr.value, 0) * -1),
      children: receivables.sort((a, b) => new Date(a.paidAt).getTime() - new Date(b.paidAt).getTime()).filter(receivable => receivable.bankAccountId === bank.id && moment(receivable.paidAt).isBetween(periodStartsAt, periodEndsAt, "day", "[]")).map(receivable => ({
        id: receivable.id,
        name: `----- ${receivable.name}`,
        values: periods.map(period => moment(receivable.paidAt).isBetween(period.startsAt, period.endsAt, "day", "[]")? receivable.value : 0),
        children: null,
        type: "PAYABLE",
      } as CashFlow)),
      type: "BANK",
    } as CashFlow));

    const receivableBalance: CashFlow = {
      id: null,
      name: "receitas",
      values: periods.map(period => receivables.filter(receivable => moment(receivable.paidAt).isBetween(period.startsAt, period.endsAt, "day", "[]")).reduce((prev, crr) => prev + crr.value, 0) * -1),
      children: receivableBankAccountsBalance,
      type: "RECEIVABLE_MARK",
    };

    flow.push(formatedPeriods);
    flow.push(payableBalance);
    flow.push(receivableBalance);
    flow.push(finalBalance);

    return of({ data: flow, pagination: null }).pipe();
  };

    getGraphValues(params: GetAllCashFlowByFilterParams): Observable<PllPaginatedResponse<GetAllCashFlowByFilterResponse>> {
      return this.getAllByFilter(params);
    };
};