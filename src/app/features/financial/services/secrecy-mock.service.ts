import { PllMockedRestService } from "@pollaris";
import { Secrecy } from "../models/secrecy.model";
import { GetAllSecrecyByFilterParams, GetAllSecrecyByFilterResponse, SecrecyService } from "./secrecy.service";
import { delay, Observable, of } from "rxjs";
import { fakerJs } from "../../../core/config/faker.config";
import { v4 as uuid } from 'uuid';

export function createMokedSecrecy(data: Partial<Secrecy>): Secrecy {
  return new Secrecy({
    active: true,
    ...data,
    id: data.id || uuid(),
  });
};

export const INITIAL_SECRECY_MOCKED_DATA: Secrecy[] = [
  createMokedSecrecy({ name: "Dinheiro" }),
  createMokedSecrecy({ name: "PIX" }),
  createMokedSecrecy({ name: "Débito" }),
  createMokedSecrecy({ name: "Crédito" }),
];

export class SecrecyMockedService extends PllMockedRestService<Secrecy> implements SecrecyService {

  constructor () {
    super(INITIAL_SECRECY_MOCKED_DATA);
  };

  override createRecord = (data: Partial<Secrecy>) => createMokedSecrecy(data);

  getAllByFilter(params: GetAllSecrecyByFilterParams): Observable<GetAllSecrecyByFilterResponse[]> {
    return of(this._filtering(this.records(), params)).pipe(
      delay(fakerJs.helpers.rangeToNumber({ min: 100, max: 500 })),
    );
  };

  private _filtering(records: Secrecy[], params: GetAllSecrecyByFilterParams): Secrecy[] {
    return records.filter(record => !params.status || params.status === "ALL"? true : params.status === "ACTIVE"? record.active : !record.active);
  };
};