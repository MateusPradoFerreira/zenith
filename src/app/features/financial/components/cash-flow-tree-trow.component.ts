import { Component, inject, input, signal } from "@angular/core";
import { GlobalModule } from "../../../core/modules/global-module.module";
import { CashFlow } from "../models/cash-flow.model";
import { PayableFacade } from "../facades/payable.facade";
import { ReceivableFacade } from "../facades/receivable.facade";

@Component({
  standalone: true,
  selector: 'app-cash-flow-tree-trow',
  imports: [GlobalModule],
  template: `
    <hlm-trow *ngIf="data().type === 'BANK'? data()?.children?.length : true" (click)="handleClickRow()" class="{{ level() >= 2? 'hover:bg-slate-50' : data().type === 'MARK' || data().type === 'BANK'? ( level()? 'bg-slate-50' : 'bg-slate-100 hover:bg-slate-100') : 'hover:bg-white' }} {{ level()? 'cursor-pointer' : '' }}">
      <hlm-td class="flex-1" truncateClass="{{ level() === 1? 'flex' : '' }} gap-4 justify-between items-center">
        <span>{{ data().name }}</span>
        <i-lucide *ngIf="level() === 1" [name]="opened()? 'chevron-down' : 'chevron-up'" size="16" class="cursor-pointer" />
      </hlm-td>
      <hlm-td class="w-29 justify-end {{ level()? 'text-slate-500' : data().type === 'RECEIVABLE_MARK'? 'font-medium text-emerald-500' : data().type === 'PAYABLE_MARK'? 'font-medium text-red-500' : 'font-medium text-blue-500' }}" *ngFor="let value of data().values">
        <span *ngIf="data().type !== 'PERCENT'">{{ value | currency: "BRL" }}</span>
        <span *ngIf="data().type === 'PERCENT'" class="flex {{ value >= 0? 'text-emerald-500' : 'text-red-500' }}">
          {{ value }}%
          <i-lucide [name]="value >= 0? 'trending-up' : 'trending-down'" size="16" class="ml-1" />
        </span>
      </hlm-td>
    </hlm-trow>
    <ng-container *ngIf="data()?.children && (level() !== 1? true : opened())">
      <app-cash-flow-tree-trow *ngFor="let children of data()?.children" [data]="children" [level]="level() + 1" />
    </ng-container>
  `,
})
export class CashFlowTreeTrowComponent {
  data = input.required<CashFlow>();
  level = input<number>(0);

  payableFacade = inject(PayableFacade);
  receivableFacade = inject(ReceivableFacade);

  opened = signal<boolean>(false);

  handleClickRow() {
    if(this.data().type === "BANK") this.handleToggleOpend();
    if(this.data().type === "PAYABLE") this.payableFacade.openToUpdate(this.data().id);
    if(this.data().type === "RECEIVABLE") this.receivableFacade.openToUpdate(this.data().id);
  };

  handleToggleOpend() {
    this.opened.set(!this.opened());
  };
};