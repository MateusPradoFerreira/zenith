import { PllID, PllMockRestService, PllPaginatedResponse } from "@pollaris";
import { Schedule } from "../models/schedule.model";
import { GetAllScheduleByFilterParams, GetAllScheduleByFilterResponse, ScheduleService } from "./schedule.service";
import { delay, lastValueFrom, map, Observable, of } from "rxjs";
import { fakerJs } from "../../../core/config/faker.config";
import { v4 as uuid } from 'uuid';
import { inject, Injectable } from "@angular/core";
import { INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA } from "./schedule-category-mock.service";
import moment from "moment";
import { ScheduleCategoryService } from "./schedule-category.service";
import { ReceivableService } from "../../financial/services/receivable.service";
import { PayableService } from "../../financial/services/payable.service";
import { CurrencyPipe } from "@angular/common";
import { Util } from "../../../common/util/util";

export function createMockedSchedule(data: Partial<Schedule>): Schedule {
  return new Schedule({
    title: "New Schedule",
    scheduleId: null,
    recurrenceId: null,
    categoryId: fakerJs.helpers.arrayElement(INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA).id,
    createdAt: data.startsAt || moment().toDate(),
    startsAt: data.startsAt || moment().toDate(),
    endsAt: data.startsAt || moment().toDate(),
    startsAtTime: "08:00:00",
    endsAtTime: "09:00:00",
    ...data,
    id: data.id || uuid(),
  });
};

function buildMockedSchedules(title: string, startsAtTime: string, endsAtTime: string, categoryId: PllID, exeptions: number[] = [], only: boolean = false, days: number = 0): Schedule[] {
  const schedules: Schedule[] = [];
  let date = moment().subtract(2, "months").startOf("month");
  while (date.isBefore(moment().add(2, "months").endOf("month"))) {
    if(only? exeptions.includes(date.day()) : !exeptions.includes(date.day())) schedules.push(createMockedSchedule({ title, startsAt: date.toDate(), endsAt: date.add(days, "days").toDate(), startsAtTime, endsAtTime, categoryId }));
    date = date.add(1, "day");
  };
  return schedules;
};

@Injectable({ providedIn: "root" })
export class ScheduleMockService extends PllMockRestService<Schedule> implements ScheduleService {
  scheduleCategoryService = inject(ScheduleCategoryService);
  payableService = inject(PayableService);
  receivableService = inject(ReceivableService);
  currencyPipe = inject(CurrencyPipe);

  constructor() {
    super([
      ...buildMockedSchedules("OnDoctor - Daily", "09:00:00", "09:00:00", INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[0].id, [0,6]),
      ...buildMockedSchedules("OnDoctor - Treinamento", "09:00:00", "09:00:00", INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[0].id, [6], true),
      ...buildMockedSchedules("Caminhada", "06:30:00", "07:20:00", INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[1].id, [0]),
      ...buildMockedSchedules("Curso de DSA", "07:30:00", "08:00:00", INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[3].id, [0]),
      ...buildMockedSchedules("PJ - Zenith", null, null, INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[3].id, [1,3,5], true),
      ...buildMockedSchedules("Estudo Avulso", null, null, INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[3].id, [2,4,6], true),
      ...buildMockedSchedules("Leitura", null, null, INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[2].id, [0]),
      ...buildMockedSchedules("Dentista", "10:00:00", "10:30:00", INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[2].id, [1], true),
      ...buildMockedSchedules("2h - ref. layout", null, null, INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[0].id, [4], true, 1),
      ...buildMockedSchedules("4h - ref. documentos", null, null, INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[0].id, [1], true, 2),
    ]);
  };

  override createRecord = (data: Partial<Schedule>) => createMockedSchedule(data);

  getAllByFilter(params: GetAllScheduleByFilterParams): Observable<PllPaginatedResponse<GetAllScheduleByFilterResponse>> {
    return of(this._filtering(this.records(), params)).pipe(
      delay(fakerJs.helpers.rangeToNumber({ min: 100, max: 500 })),
      map(response => response.map(record => {
        const newRecord: GetAllScheduleByFilterResponse = {
          ...record,
          category: this.scheduleCategoryService.records().find(category => category.id === record.categoryId)?.name || "",
          color: record.color || this.scheduleCategoryService.records().find(category => category.id === record.categoryId)?.color || "VIOLET",
          type: this.scheduleCategoryService.records().find(category => category.id === record.categoryId)?.type || "SCHEDULE",
        };
        return newRecord;
      })),
      map(response => Util.paginatedValueFrom(response)),
    );
  };

  private _filtering(records: Schedule[], params: GetAllScheduleByFilterParams): Schedule[] {
    let newRecords = [...records];

    const payableCategory = this.scheduleCategoryService.records().find(record => record.type === "PAYABLE");
    const receivableCategory = this.scheduleCategoryService.records().find(record => record.type === "RECEIVABLE");

    if(payableCategory && (!params || params.categoryIds.includes(payableCategory.id))) {
      const payables = this.payableService.records().filter(record => moment(record.dueAt).isBetween(params.startsAt, params.endsAt, "day", "[]") && (record.status === "PENDING" || record.status === "OVERDUE"));
      for(let payable of payables) newRecords.push(createMockedSchedule({ id: payable.id, title: payable.name + " - " + this.currencyPipe.transform(payable.value, "BRL"), startsAt: payable.dueAt, endsAt: payable.dueAt, categoryId: payableCategory.id, startsAtTime: null, endsAtTime: null }));
    };

    if(receivableCategory && (!params || params.categoryIds.includes(receivableCategory.id))) {
      const receivables = this.receivableService.records().filter(record => moment(record.dueAt).isBetween(params.startsAt, params.endsAt, "day", "[]") && (record.status === "PENDING" || record.status === "OVERDUE"));
      for(let receivable of receivables) newRecords.push(createMockedSchedule({ id: receivable.id, title: receivable.name + " - " + this.currencyPipe.transform(receivable.value, "BRL"), startsAt: receivable.dueAt, endsAt: receivable.dueAt, categoryId: receivableCategory.id, startsAtTime: null, endsAtTime: null }));
    };

    newRecords = newRecords.filter(record => !params?.categoryIds? true : params.categoryIds.includes(record.categoryId) );
    return newRecords.filter(record => moment(record.startsAt).isBetween(params.startsAt, params.endsAt, "day", "[]") || moment(record.endsAt).isBetween(params.startsAt, params.endsAt, "day", "[]"));
  };
};