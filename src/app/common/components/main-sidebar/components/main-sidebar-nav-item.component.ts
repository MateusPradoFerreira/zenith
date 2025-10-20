
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MainLayoutlState } from '../../../states/main-layout.state';
import { Router, RouterLink } from '@angular/router';
import { GlobalModule } from '../../../../core/modules/global-module.module';

@Component({
  selector: 'ms-nav-item',
  imports: [GlobalModule, RouterLink],
  template: `
    <a [routerLink]="to" class="{{ isActive()? 'bg-slate-200/70' : 'hover:bg-slate-200/70' }} rounded-lg cursor-pointer flex items-center mb-0.5" (click)="command.emit()">
      <div class="w-[47px] h-[47px] flex items-center justify-center shrink-0">
        <i-lucide [name]="icon" size="22"></i-lucide>
      </div>
      <span class="text-[13px] mt-0.5 transition {{ active() || hovering()? 'opacity-100' : 'opacity-0' }}">{{label}}</span>
    </a>
  `,
})
export class MainSidebarNavItemComponent {
  @Input({ required: true }) label: string = "";
  @Input({ required: true }) icon: string = "";
  @Input() to: string = "";

  @Output() command: EventEmitter<void> = new EventEmitter();

  private state = inject(MainLayoutlState);
  private router: Router = inject(Router);

  active = this.state.active;
  hovering = this.state.hovering;

  isActive = () => !this.to? false : this.router.isActive(this.to, { queryParams: "ignored", fragment: "ignored", matrixParams: "ignored", paths: "subset" });
};