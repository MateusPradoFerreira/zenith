import { PllMockRestService, PllRecordRepository, PllRecordState } from "@pollaris";
import { Recurrence } from "../../models/recurrence.model";
import { RecurrenceService } from "../recurrence.service";
import { v4 as uuid } from 'uuid';
import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class RecurrenceMockState extends PllRecordState<Recurrence> {};

@Injectable({ providedIn: "root" })
export class RecurrenceMockRepository extends PllRecordRepository<Recurrence> {
  override state = inject(RecurrenceMockState);
};

@Injectable({ providedIn: "root" })
export class RecurrenceMockService extends PllMockRestService<Recurrence> implements RecurrenceService {
  override repository = inject(RecurrenceMockRepository);
};