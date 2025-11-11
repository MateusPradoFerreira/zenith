
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayoutlState } from '../../states/main-layout.state';
import { MainSidebarComponent } from '../../components/main-sidebar/main-sidebar.component';
import { GlobalModule } from '../../../core/modules/global-module.module';
import { MainHeaderComponent } from '../../components/main-header/main-header.component';
import { AuthState } from '../../../features/auth/states/auth.state';

@Component({
  selector: 'app-main-layout',
  imports: [GlobalModule, RouterOutlet, MainSidebarComponent, MainHeaderComponent],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  authState = inject(AuthState);
  state = inject(MainLayoutlState);

  userData = this.authState.userData;
  isLoggedIn = this.authState.isLoggedIn;
  active = this.state.active;
  hovering = this.state.hovering;
};
