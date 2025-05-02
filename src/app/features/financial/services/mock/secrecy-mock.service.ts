import { Injectable } from "@angular/core";
import { BaseMockService } from "../../../../core/base/base-mock-service";
import { Secrecy } from "../../models/secrecy.model";
import { GetAllSecrecyByFilterParams, SecrecyService } from "../secrecy.service";
import { delay, Observable, of } from "rxjs";
import { fakerJs } from "../../../../core/config/faker.config";

export const InitialSecrecyMockRegistries: Secrecy[] = [
  Secrecy.create({ name: "Dinheiro", default: true }),
  Secrecy.create({ name: "Pix" }),
  Secrecy.create({ name: "Cartão de Crédito" }),
  Secrecy.create({ name: "Cartão de Débito" }),
  Secrecy.create({ name: "Transferência Bancária" }),
  Secrecy.create({ name: "Boleto" }),
  Secrecy.create({ name: "Cheque", active: false }),
  Secrecy.create({ name: "Conta Corrente" }),
  Secrecy.create({ name: "Conta Caixa" }),
  Secrecy.create({ name: "Empréstimo", active: false }),
  Secrecy.create({ name: "Vale", active: false }),
];

@Injectable()
export class SecrecyMockService extends BaseMockService<Secrecy> implements SecrecyService {
  constructor() { super({ initialData: InitialSecrecyMockRegistries }) };

  override create(props: Partial<Secrecy>): Secrecy {
    return Secrecy.create(props);
  };

  getAllByFilter({ status }: GetAllSecrecyByFilterParams): Observable<Secrecy[]> {
    const filteredData = this.filterByStatus(this.registries, status);
    return of(filteredData).pipe(delay(fakerJs.number.int({ min: 50, max: 300 }))) as Observable<Secrecy[]>;
  };
};