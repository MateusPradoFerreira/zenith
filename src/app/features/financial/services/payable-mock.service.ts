import { Injectable } from "@angular/core";
import { BaseMockService } from "../../../core/base/base-mock-service";
import { GetAllPayableResponse, Payable } from "../models/payable.model";
import { GetAllPayableByFilterParams, PayableService } from "./payable.service";
import { delay, Observable, of } from "rxjs";
import { fakerJs } from "../../../core/config/faker.config";

@Injectable()
export class PayableMockService extends BaseMockService<Payable> implements PayableService {
  route: string = "payable";
  
  override createRegistry(props: Partial<Payable>): Payable {
    return Payable.createRegistry(props);
  };

  getAllByFilter({ startsAt, endsAt }: GetAllPayableByFilterParams): Observable<GetAllPayableResponse[]> {
    const registries = this.registries.map(payable => GetAllPayableResponse.createRegistry({ id: payable.id, name: payable.name, amount: payable.value }));
    return of(registries).pipe(delay(fakerJs.number.int({ min: 50, max: 300 }))) as Observable<GetAllPayableResponse[]>;
  };

}
