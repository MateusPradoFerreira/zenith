import { Component, inject } from '@angular/core';
import { MainLayoutlState } from '../../states/main-layout.state';
import { MainSidebarNavItemComponent } from './components/main-sidebar-nav-item.component';
import { MainSidebarNavSeparatorComponent } from './components/main-sidebar-nav-separator.component';
import { GlobalModule } from '../../../core/modules/global-module.module';
import { AuthState } from '../../../features/auth/states/auth.state';

@Component({
  selector: 'app-main-sidebar',
  imports: [GlobalModule, MainSidebarNavItemComponent, MainSidebarNavSeparatorComponent],
  templateUrl: './main-sidebar.component.html',
})
export class MainSidebarComponent {
  authState = inject(AuthState);
  state: MainLayoutlState = inject(MainLayoutlState);

  userData = this.authState.userData;
  active = this.state.active;
  hovering = this.state.hovering;
};
