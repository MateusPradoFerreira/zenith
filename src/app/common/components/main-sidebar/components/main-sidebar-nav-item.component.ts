
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MainLayoutlState } from '../../../states/main-layout.state';
import { RouterLink } from '@angular/router';
import { GlobalModule } from '../../../../core/modules/global-module.module';

@Component({
  selector: 'ms-nav-item',
  imports: [GlobalModule, RouterLink],
  template: `
    <a [routerLink]="to" class="py-2.5 px-[14px] hover:bg-slate-200/70 rounded-lg cursor-pointer flex items-center gap-4 mb-1" (click)="command.emit()">
      <i-lucide [name]="icon" size="22"></i-lucide>
      <span class="text-sm mt-0.5 transition {{ active || hovering? 'opacity-100' : 'opacity-0' }}">{{label}}</span>
    </a>
  `,
})
export class MainSidebarNavItemComponent {
  @Input({ required: true }) label: string = "";
  @Input({ required: true }) icon: string = "";
  @Input() to: string = "";

  @Output() command: EventEmitter<void> = new EventEmitter();

  state = inject(MainLayoutlState);
  
  active: boolean = false;
  hovering: boolean = false;

  ngOnInit() {
    this.state.active$.subscribe(active => this.active = active);
    this.state.hovering$.subscribe(hovering => this.hovering = hovering);
  };
}
