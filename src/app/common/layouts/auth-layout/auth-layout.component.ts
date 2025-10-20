
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalModule } from '../../../core/modules/global-module.module';
import { AuthFacade } from '../../../features/auth/facades/auth.facade';

@Component({
  selector: 'app-auth-layout',
  imports: [GlobalModule, RouterOutlet],
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent {
  facade = inject(AuthFacade);
  isLoggedIn = this.facade.state.isLoggedIn;
};
