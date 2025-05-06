import { Injectable } from "@angular/core";
import { BaseMockService } from "../../../../core/base/base-mock-service";
import { Receivable } from "../../models/receivable.model";
import { GetAllReceivableByFilterParams, ReceivableService } from "../receivable.service";
import { delay, Observable, of } from "rxjs";
import { fakerJs } from "../../../../core/config/faker.config";

@Injectable()
export class ReceivableMockService extends BaseMockService<Receivable> implements ReceivableService {
  constructor() { super() };

  override create(props: Partial<Receivable>): Receivable {
    return Receivable.create(props);
  };

  getAllByFilter({}: GetAllReceivableByFilterParams): Observable<Receivable[]> {
    return of(this.registries).pipe(delay(fakerJs.number.int({ min: 50, max: 300 }))) as Observable<Receivable[]>;
  };
}