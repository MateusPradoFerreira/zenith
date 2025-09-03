import { PllMockedRestService, PllPaginatedResponse } from "@pollaris";
import { Schedule } from "../models/schedule.model";
import { GetAllScheduleByFilterParams, GetAllScheduleByFilterResponse, ScheduleService } from "./schedule.service";
import { delay, map, Observable, of } from "rxjs";
import { fakerJs } from "../../../core/config/faker.config";
import { v4 as uuid } from 'uuid';
import { inject, Injectable } from "@angular/core";
import { INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA } from "./schedule-category-mock.service";
import moment from "moment";
import { ScheduleCategoryService } from "./schedule-category.service";

export function createMockedSchedule(data: Partial<Schedule>): Schedule {
  return new Schedule({
    title: "New Schedule",
    scheduleId: null,
    recurrenceId: null,
    categoryId: fakerJs.helpers.arrayElement(INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA).id,
    createdAt: moment().toDate(),
    startsAt: moment().toDate(),
    endsAt: moment().toDate(),
    startsAtTime: "08:00:00",
    endsAtTime: "09:00:00",
    ...data,
    id: data.id || uuid(),
  });
};

@Injectable({ providedIn: "root" })
export class ScheduleMockedService extends PllMockedRestService<Schedule> implements ScheduleService {
  scheduleCategoryService = inject(ScheduleCategoryService);

  constructor() {
    super([
      createMockedSchedule({ title: "OnDoctor - Daily", startsAt: moment("01/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("01/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("09:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("09:00:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[0].id }),
      createMockedSchedule({ title: "OnDoctor - Daily", startsAt: moment("02/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("02/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("09:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("09:00:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[0].id }),
      createMockedSchedule({ title: "OnDoctor - Daily", startsAt: moment("03/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("03/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("09:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("09:00:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[0].id }),
      createMockedSchedule({ title: "OnDoctor - Daily", startsAt: moment("04/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("04/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("09:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("09:00:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[0].id }),
      createMockedSchedule({ title: "OnDoctor - Daily", startsAt: moment("05/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("05/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("09:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("09:00:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[0].id }),
      createMockedSchedule({ title: "OnDoctor - Treinamento", startsAt: moment("06/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("06/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("09:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("10:30:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[0].id }),

      createMockedSchedule({ title: "Caminhada", startsAt: moment("01/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("01/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("06:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("06:45:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[1].id }),
      createMockedSchedule({ title: "Caminhada", startsAt: moment("02/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("02/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("06:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("06:45:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[1].id }),
      createMockedSchedule({ title: "Caminhada", startsAt: moment("03/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("03/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("06:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("06:45:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[1].id }),
      createMockedSchedule({ title: "Caminhada", startsAt: moment("04/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("04/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("06:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("06:45:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[1].id }),
      createMockedSchedule({ title: "Caminhada", startsAt: moment("05/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("05/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("06:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("06:45:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[1].id }),
      createMockedSchedule({ title: "Caminhada", startsAt: moment("06/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("06/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("06:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("06:45:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[1].id }),

      createMockedSchedule({ title: "Curso de DSA", startsAt: moment("01/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("01/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("07:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("08:00:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[1].id }),
      createMockedSchedule({ title: "Curso de DSA", startsAt: moment("02/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("02/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("07:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("08:00:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[1].id }),
      createMockedSchedule({ title: "Curso de DSA", startsAt: moment("03/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("03/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("07:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("08:00:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[1].id }),
      createMockedSchedule({ title: "Curso de DSA", startsAt: moment("04/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("04/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("07:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("08:00:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[1].id }),
      createMockedSchedule({ title: "Curso de DSA", startsAt: moment("05/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("05/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("07:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("08:00:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[1].id }),
      createMockedSchedule({ title: "Curso de DSA", startsAt: moment("06/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("06/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("07:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("08:00:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[1].id }),

      createMockedSchedule({ title: "PJ - Zenith", startsAt: moment("01/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("01/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("17:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("18:30:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[1].id }),
      createMockedSchedule({ title: "Estudo Avulso", startsAt: moment("02/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("02/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("17:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("18:30:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[1].id }),
      createMockedSchedule({ title: "PJ - Zenith", startsAt: moment("03/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("03/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("17:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("18:30:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[1].id }),
      createMockedSchedule({ title: "Estudo Avulso", startsAt: moment("04/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("04/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("17:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("18:30:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[1].id }),
      createMockedSchedule({ title: "PJ - Zenith", startsAt: moment("05/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("05/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("17:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("18:30:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[1].id }),
      createMockedSchedule({ title: "Estudo Avulso", startsAt: moment("06/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("06/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: moment("17:00:00", "HH:mm:ss").format("HH:mm:ss"), endsAtTime: moment("18:30:00", "HH:mm:ss").format("HH:mm:ss"), categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[1].id }),

      createMockedSchedule({ title: "Leitura", startsAt: moment("01/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("01/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: null, endsAtTime: null, categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[2].id }),
      createMockedSchedule({ title: "Leitura", startsAt: moment("02/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("02/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: null, endsAtTime: null, categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[2].id }),
      createMockedSchedule({ title: "Leitura", startsAt: moment("03/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("03/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: null, endsAtTime: null, categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[2].id }),
      createMockedSchedule({ title: "Leitura", startsAt: moment("04/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("04/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: null, endsAtTime: null, categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[2].id }),
      createMockedSchedule({ title: "Leitura", startsAt: moment("05/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("05/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: null, endsAtTime: null, categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[2].id }),
      createMockedSchedule({ title: "Leitura", startsAt: moment("06/09/2025", "DD/MM/YYYY").toDate(), endsAt: moment("06/09/2025", "DD/MM/YYYY").toDate(), startsAtTime: null, endsAtTime: null, categoryId: INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA[2].id }),
    ]);
  };

  override createRecord = (data: Partial<Schedule>) => createMockedSchedule(data);

  getAllByFilter(params: GetAllScheduleByFilterParams): Observable<PllPaginatedResponse<GetAllScheduleByFilterResponse>> {
    return of(this._filtering(this.records(), params).map(record => {
      const newRecord: GetAllScheduleByFilterResponse = {
        ...record,
        category: this.scheduleCategoryService.records().find(category => category.id === record.categoryId)?.name || "",
        color: this.scheduleCategoryService.records().find(category => category.id === record.categoryId)?.color || "VIOLET",
      };
      return newRecord;
    })).pipe(delay(fakerJs.helpers.rangeToNumber({ min: 100, max: 500 }))).pipe(map(response => ({
      data: response,
      pagination: {
        page: 1,
      },
    })));
  };

  private _filtering(records: Schedule[], params: GetAllScheduleByFilterParams): Schedule[] {
    return records.filter(record => moment(record.startsAt).isBetween(params.startsAt, params.endsAt, "day", "[]") || moment(record.endsAt).isBetween(params.startsAt, params.endsAt, "day", "[]"));
  };
};