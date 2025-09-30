import { PllMockRestService } from "@pollaris";
import { Recurrence } from "../../models/recurrence.model";
import { RecurrenceService } from "../recurrence.service";
import { v4 as uuid } from 'uuid';
import { Injectable } from "@angular/core";

export function createMockedRecurrence(data: Partial<Recurrence>): Recurrence {
  return new Recurrence({
    ...data,
    id: data.id || uuid(),
  });
};

@Injectable({ providedIn: "root" })
export class RecurrenceMockService extends PllMockRestService<Recurrence> implements RecurrenceService {
  constructor() {
    super([]);
  };

  override createRecord = (data: Partial<Recurrence>) => createMockedRecurrence(data);
};