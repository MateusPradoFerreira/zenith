import { PllMockedRestService } from "@pollaris";
import { Inbox } from "../models/inbox.model";
import { GetAllInboxByFilterParams, InboxService } from "./inbox.service";
import { delay, Observable, of } from "rxjs";
import { fakerJs } from "../../../core/config/faker.config";
import moment from "moment";
import { v4 as uuid } from 'uuid';
import { Injectable } from "@angular/core";

export function createMokedInbox(data: Partial<Inbox>): Inbox {
  return new Inbox({
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
      createMokedInbox({ title: "Reunião com equipe de vendas" }),
      createMokedInbox({ title: "Atualização do projeto Alpha" }),
      createMokedInbox({ title: "Relatório financeiro mensal" }),
      createMokedInbox({ title: "Solicitação de orçamento" }),
      createMokedInbox({ title: "Feedback do cliente XYZ" }),
      createMokedInbox({ title: "Convite para webinar de tecnologia" }),
      createMokedInbox({ title: "Entrega do material de marketing" }),
      createMokedInbox({ title: "Análise de desempenho trimestral" }),
    ]);
  };

  override createRecord = (data: Partial<Inbox>) => createMokedInbox(data);

  getAllByFilter(params: GetAllInboxByFilterParams): Observable<Inbox[]> {
    return of(this._filtering(this.records(), params)).pipe(delay(fakerJs.helpers.rangeToNumber({ min: 100, max: 500 })));
  };

  private _filtering(records: Inbox[], params: GetAllInboxByFilterParams): Inbox[] {
    records = records.filter(record => !params.status || params.status === "ALL"? true : params.status === "TOMAKE"? ["PENDING", "OVERDUE"].includes(record.status) : record.status === params.status);
    records = records.filter(record => !params.priority || params.priority === "ALL"? true : record.priority === params.priority);
    return records.filter(record => moment(record.status === "OVERDUE"? record.dueAt : record.createdAt).isBetween(params.startsAt, params.endsAt));
  };
};