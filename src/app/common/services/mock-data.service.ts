import { inject, Injectable } from "@angular/core";
import { CenterOfCostMockRepository } from "../../features/financial/services/mock/center-of-cost-mock.service";
import { PlanOfAccountMockRepository } from "../../features/financial/services/mock/plan-of-account-mock.service";
import { SecrecyMockRepository } from "../../features/financial/services/mock/secrecy-mock.service";
import { BankAccountMockRepository } from "../../features/financial/services/mock/bank-account-mock.service";
import { ScheduleCategoryMockRepository } from "../../features/schedule/services/mock/schedule-category-mock.service";

@Injectable({ providedIn: 'root' })
export class MockDataService {
  
  private secrecyMockRepository = inject(SecrecyMockRepository);
  private bankAccountMockRepository = inject(BankAccountMockRepository);
  private centerOfCostMockRepository = inject(CenterOfCostMockRepository);
  private planOfAccountMockRepository = inject(PlanOfAccountMockRepository);
  private scheduleCategoryMockRepository = inject(ScheduleCategoryMockRepository);

  initMockedData() {
    this.secrecyMockRepository.create({ id: null, name: "Dinheiro", active: true });
    this.secrecyMockRepository.create({ id: null, name: "Cartão de Débito", active: true });
    this.secrecyMockRepository.create({ id: null, name: "Cartão de Crédito", active: true });
    this.secrecyMockRepository.create({ id: null, name: "Pix", active: true });

    this.bankAccountMockRepository.create({ id: null, name: "Sicoob", active: true });
    this.bankAccountMockRepository.create({ id: null, name: "Nubank", active: true });
    this.bankAccountMockRepository.create({ id: null, name: "Mercado Pago", active: true });

    this.centerOfCostMockRepository.create({ id: null, name: "Geral", active: true });
    this.planOfAccountMockRepository.create({ id: null, name: "Geral", active: true });

    this.scheduleCategoryMockRepository.create({ id: null, name: "Evento", color: "VIOLET", type: "SCHEDULE", active: true });
    this.scheduleCategoryMockRepository.create({ id: null, name: "Atividade", color: "TEAL", type: "SCHEDULE", active: true });
    this.scheduleCategoryMockRepository.create({ id: null, name: "Despesa", color: "EMERALD", type: "PAYABLE", active: true });
    this.scheduleCategoryMockRepository.create({ id: null, name: "Receita", color: "RED", type: "RECEIVABLE", active: true });
  };

};