import { Component, input, signal } from "@angular/core";
import { GlobalModule } from "../../../core/modules/global-module.module";
import { CashFlow } from "../models/cash-flow.model";

@Component({
  standalone: true,
  selector: 'app-cash-flow-tree-trow',
  imports: [GlobalModule],
  template: `
    <hlm-trow (click)="handleToggleOpend()" class="{{ level() >= 2? 'hover:bg-slate-50' : data().type === 'MARK' || data().type === 'BANK'? ( level()? 'bg-slate-50' : 'bg-slate-100 hover:bg-slate-100') : 'hover:bg-white' }} {{ level()? 'cursor-pointer' : '' }}">
      <hlm-td class="truncate flex-1 justify-between">
        <span>{{ data().name }}</span>
        <i-lucide *ngIf="level() === 1" [name]="opened()? 'chevron-down' : 'chevron-up'" size="16" class="cursor-pointer" />
      </hlm-td>
      <hlm-td class="truncate w-29 justify-end {{ level()? 'text-slate-500' : data().type === 'RECEIVABLE_MARK'? 'font-medium text-emerald-500' : data().type === 'PAYABLE_MARK'? 'font-medium text-red-500' : 'font-medium text-blue-500' }}" *ngFor="let value of data().values">{{ value | currency: "BRL" }}</hlm-td>
    </hlm-trow>
    <ng-container *ngIf="data()?.children && (level() !== 1? true : opened())">
      <app-cash-flow-tree-trow *ngFor="let children of data()?.children" [data]="children" [level]="level() + 1" />
    </ng-container>
  `,
})
export class CashFlowTreeTrowComponent {
  data = input.required<CashFlow>();
  level = input<number>(0);
  opened = signal<boolean>(false);

  handleToggleOpend() {
    if(this.level() !== 1) return;
    this.opened.set(!this.opened());
  };
};