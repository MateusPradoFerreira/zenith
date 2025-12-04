import { PllMockRestService, PllPaginatedResponse, PllRecordRepository, PllRecordState } from "@pollaris";
import { FinancialRecurrence } from "../../models/financial-recurrence.model";
import { FinancialRecurrenceViewParams, FinancialRecurrenceService } from "../financial-recurrence.service";
import { delay, map, Observable, switchMap } from "rxjs";
import { inject, Injectable } from "@angular/core";
import { event, EventObs } from "../../../../common/directives/base-form-component.directive";
import { RecurrenceMockService } from "../../../schedule/services/mock/recurrence-mock.service";

@Injectable({ providedIn: "root" })
export class FinancialRecurrenceMockState extends PllRecordState<FinancialRecurrence> {};

@Injectable({ providedIn: "root" })
export class FinancialRecurrenceMockRepository extends PllRecordRepository<FinancialRecurrence> {
  override state = inject(FinancialRecurrenceMockState);
};

export class FinancialRecurrenceMockService extends PllMockRestService<FinancialRecurrence> implements FinancialRecurrenceService {
  override repository = inject(FinancialRecurrenceMockRepository);

  recurrenceMockService = inject(RecurrenceMockService);
  
  override $evInitPost: EventObs<FinancialRecurrence> = event(
    switchMap(financialRecurrence => this.recurrenceMockService.post({
      id: null,
      endType: "NEVER",
      frequency: "MONTHLY", 
      byWeekday: [],
      interval: 1,
      count: 0,
      createdAt: new Date(),
      startsAt: financialRecurrence.createdAt,
      endsAt: financialRecurrence.createdAt,
      active: true,
    }).pipe(map(recurrence =>({ ...financialRecurrence, recurrenceId: recurrence.id })))),
  );

  getAllByFilter(params: FinancialRecurrenceViewParams): Observable<PllPaginatedResponse<FinancialRecurrence>> {
    return this.repository.$find({
      active: !params.status || params.status === "ALL"? undefined : params.status === "ACTIVE"? true : false,
    }).pipe(delay(this.delay()));
  };
};