import { PllMockedRestService, PllPaginatedResponse } from "@pollaris";
import { Inbox } from "../models/inbox.model";
import { GetAllInboxByFilterParams, InboxService } from "./inbox.service";
import { delay, map, Observable, of } from "rxjs";
import { fakerJs } from "../../../core/config/faker.config";
import moment from "moment";
import { v4 as uuid } from 'uuid';
import { Injectable } from "@angular/core";

export function createMockedInbox(data: Partial<Inbox>): Inbox {
  return new Inbox({
    title: "Inbox",
    status: fakerJs.helpers.arrayElement(["PENDING", "PROCESSED", "OVERDUE", "CANCELLED"]),
    priority: fakerJs.helpers.arrayElement(["LOW", "MEDIUM", "HIGH"]),
    createdAt: fakerJs.date.between({ from: moment().startOf("month").toDate(), to: moment().endOf("month").toDate() }),
    dueAt: fakerJs.date.between({ from: moment().startOf("month").toDate(), to: moment().endOf("month").toDate() }),
    ...data,
    id: data.id || uuid(),
  });
};

@Injectable({ providedIn: "root" })
export class InboxMockedService extends PllMockedRestService<Inbox> implements InboxService {

  constructor () {
    super([
      createMockedInbox({ title: "Reunião com equipe de vendas" }),
      createMockedInbox({ title: "Atualização do projeto Alpha" }),
      createMockedInbox({ title: "Relatório financeiro mensal" }),
      createMockedInbox({ title: "Solicitação de orçamento" }),
      createMockedInbox({ title: "Feedback do cliente XYZ" }),
      createMockedInbox({ title: "Convite para webinar de tecnologia" }),
      createMockedInbox({ title: "Entrega do material de marketing" }),
      createMockedInbox({ title: "Análise de desempenho trimestral" }),
    ]);
  };

  override createRecord = (data: Partial<Inbox>) => createMockedInbox(data);

  getAllByFilter(params: GetAllInboxByFilterParams): Observable<PllPaginatedResponse<Inbox>> {
    return of(this._filtering(this.records(), params)).pipe(delay(fakerJs.helpers.rangeToNumber({ min: 100, max: 500 }))).pipe(map(response => ({
      data: response,
      pagination: {
        page: 1,
      },
    })));
  };

  private _filtering(records: Inbox[], params: GetAllInboxByFilterParams): Inbox[] {
    records = records.filter(record => !params.status || params.status === "ALL"? true : params.status === "TOMAKE"? ["PENDING", "OVERDUE"].includes(record.status) : record.status === params.status);
    records = records.filter(record => !params.priority || params.priority === "ALL"? true : record.priority === params.priority);
    return records.filter(record => moment(record.status === "OVERDUE"? record.dueAt : record.createdAt).isBetween(params.startsAt, params.endsAt));
  };
};