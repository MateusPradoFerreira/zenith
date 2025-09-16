import { PllMockRestService, PllPaginatedResponse } from "@pollaris";
import { ScheduleCategory } from "../models/schedule-category.model";
import { GetAllScheduleCategoryByFilterParams, ScheduleCategoryService } from "./schedule-category.service";
import { delay, map, Observable, of } from "rxjs";
import { fakerJs } from "../../../core/config/faker.config";
import { v4 as uuid } from 'uuid';
import { Injectable } from "@angular/core";
import { Util } from "../../../common/util/util";

export function createMockedScheduleCategory(data: Partial<ScheduleCategory>): ScheduleCategory {
  return new ScheduleCategory({
    name: "New Schedule Category",
    active: true,
    type: "SCHEDULE",
    color: "VIOLET",
    ...data,
    id: data.id || uuid(),
  });
};

export const INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA: ScheduleCategory[] = [
  createMockedScheduleCategory({ name: "Trabalho", color: "TEAL" }),
  createMockedScheduleCategory({ name: "Tarefa", color: "VIOLET" }),
  createMockedScheduleCategory({ name: "Evento", color: "BLUE" }),
  createMockedScheduleCategory({ name: "Estudo", color: "INDIGO" }),
  createMockedScheduleCategory({ name: "Meta", color: "SLATE", type: "GOAL" }),
  createMockedScheduleCategory({ name: "Despesa", color: "ROSE", type: "PAYABLE" }),
  createMockedScheduleCategory({ name: "Receita", color: "EMERALD", type: "RECEIVABLE" }),
];

@Injectable({ providedIn: "root" })
export class ScheduleCategoryMockService extends PllMockRestService<ScheduleCategory> implements ScheduleCategoryService {

  constructor () {
    super(INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA);
  };

  override createRecord = (data: Partial<ScheduleCategory>) => createMockedScheduleCategory(data);

  getAllByFilter(params: GetAllScheduleCategoryByFilterParams): Observable<PllPaginatedResponse<ScheduleCategory>> {
    return of(this._filtering(this.records(), params)).pipe(
      delay(fakerJs.helpers.rangeToNumber({ min: 100, max: 500 })),
      map(response => Util.paginatedValueFrom(response)),
    );
  };

  private _filtering(records: ScheduleCategory[], params: GetAllScheduleCategoryByFilterParams): ScheduleCategory[] {
    records = records.filter(record => !params.type || params.type === "ALL"? true : params.type === record.type);
    return records.filter(record => !params.status || params.status === "ALL"? true : params.status === "ACTIVE"? record.active : !record.active);
  };
};