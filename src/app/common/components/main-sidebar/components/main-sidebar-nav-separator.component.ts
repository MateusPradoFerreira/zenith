
import { Component, inject, Input } from '@angular/core';
import { MainLayoutlState } from '../../../states/main-layout.state';
import { GlobalModule } from '../../../../core/modules/global-module.module';

@Component({
  selector: 'ms-nav-separator',
  imports: [GlobalModule],
  template: `
    <div class="text-sm text-zinc-600 overflow-hidden transition-all px-4 {{ active() || hovering()? 'h-auto pb-2 pt-4 opacity-100' : 'h-0 opacity-0' }}">
      {{label}}
    </div>
  `,
})
export class MainSidebarNavSeparatorComponent {
  @Input() label: string = "";

  state = inject(MainLayoutlState);

  active = this.state.active;
  hovering = this.state.hovering;
};
