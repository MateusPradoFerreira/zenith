import { Injectable } from "@angular/core";
import { BaseMockService } from "../../../../core/base/base-mock-service";
import { Payable } from "../../models/payable.model";
import { GetAllPayableByFilterParams, PayableService } from "../payable.service";
import { delay, Observable, of } from "rxjs";
import { fakerJs } from "../../../../core/config/faker.config";

@Injectable()
export class PayableMockService extends BaseMockService<Payable> implements PayableService {
  constructor() { super() };

  override create(props: Partial<Payable>): Payable {
    return Payable.create(props);
  };

  getAllByFilter({}: GetAllPayableByFilterParams): Observable<Payable[]> {
    return of(this.registries).pipe(delay(fakerJs.number.int({ min: 50, max: 300 }))) as Observable<Payable[]>;
  };
}