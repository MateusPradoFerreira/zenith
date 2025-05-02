import { Injectable } from "@angular/core";
import { BaseMockService } from "../../../../core/base/base-mock-service";
import { CenterOfCost } from "../../models/center-of-cost.model";
import { GetAllCenterOfCostByFilterParams, CenterOfCostService } from "../center-of-cost.service";
import { delay, Observable, of } from "rxjs";
import { fakerJs } from "../../../../core/config/faker.config";

export const InitialCenterOfCostMockRegistries: CenterOfCost[] = [
  CenterOfCost.create({ name: "Geral", default: true }),
  CenterOfCost.create({ name: "Despesas Antecipadas" }),
  CenterOfCost.create({ name: "Estoques" }),
  CenterOfCost.create({ name: "Intangível" }),
  CenterOfCost.create({ name: "Imobilizado" }),
  CenterOfCost.create({ name: "Investimentos" }),
  CenterOfCost.create({ name: "Administrativo" }),
  CenterOfCost.create({ name: "Comercial" }),
  CenterOfCost.create({ name: "Financeiro" }),
  CenterOfCost.create({ name: "Marketing" }),
  CenterOfCost.create({ name: "Recursos Humanos" }),
  CenterOfCost.create({ name: "TI" }),
  CenterOfCost.create({ name: "Logística" }),
  CenterOfCost.create({ name: "Jurídico" }),
  CenterOfCost.create({ name: "Operacional" }),
  CenterOfCost.create({ name: "Serviços Terceirizados" }),
  CenterOfCost.create({ name: "Projetos Especiais" }),
  CenterOfCost.create({ name: "Pesquisa e Desenvolvimento" }),
  CenterOfCost.create({ name: "Manutenção" }),
  CenterOfCost.create({ name: "Treinamentos" }),
];

@Injectable()
export class CenterOfCostMockService extends BaseMockService<CenterOfCost> implements CenterOfCostService {
  constructor() { super({ initialData: InitialCenterOfCostMockRegistries }) };

  override create(props: Partial<CenterOfCost>): CenterOfCost {
    return CenterOfCost.create(props);
  };

  getAllByFilter({ status }: GetAllCenterOfCostByFilterParams): Observable<CenterOfCost[]> {
    const filteredData = this.filterByStatus(this.registries, status);
    return of(filteredData).pipe(delay(fakerJs.number.int({ min: 50, max: 300 }))) as Observable<CenterOfCost[]>;
  };
};