import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { GetAllGoalByFilterParams, GetAllGoalByFilterResponse } from '../../../services/goal.service';
import { GoalFacade } from '../../../facades/goal.facade';
import { HlmDataTableActionFc, HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import { CashFlowChartCardComponent } from '../../../../financial/components/cash-flow-chart-card.component';

@Component({
  standalone: true,
  selector: 'app-goal-listing',
  imports: [GlobalModule, HlmDataTableComponent, CashFlowChartCardComponent],
  templateUrl: './goal-listing.component.html',
})
export class GoalListingComponent extends BaseRecordListingComponentDirective<GetAllGoalByFilterResponse, GetAllGoalByFilterParams> {
  override facade = inject(GoalFacade);
  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "Nome", class: "w-72" },
    { header: "Sequência", class: "w-32" },
    { header: "Status", class: "flex-1" },
  ]);

  override actionFn: HlmDataTableActionFc<GetAllGoalByFilterResponse> = (data: GetAllGoalByFilterResponse) => ([
    { icon: "pencil-line", label: "Editar", disabled: this.processing(), command: () => this.handleUpdate(data) },
    { separator: true },
    { icon: "timer", label: "Cronômetro" },
    { icon: "hourglass", label: "Timer" },
    { icon: "clock-fading", label: "Pomodoro" },
    { icon: "alarm-clock-plus", label: "Novo registro" },
    { separator: true },
    { icon: "trash-2", label: "Excluir" },
  ]);

  statusOptions = [
    { label: "Todos", value: "ALL" },
    { label: "Pendente", value: "PENDING" },
    { label: "Finalizado", value: "FINISHED" },
  ];
};