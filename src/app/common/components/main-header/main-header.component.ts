
import { Component, inject, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../core/modules/global-module.module';
import { AuthState, UserData } from '../../states/auth.state';

@Component({
  selector: 'app-main-header',
  imports: [GlobalModule],
  templateUrl: './main-header.component.html',
})
export class MainHeaderComponent {
  private authState: AuthState = inject(AuthState);
  userData: WritableSignal<UserData> = this.authState.userData;
}