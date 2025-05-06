
import { Component, inject, OnInit, WritableSignal } from '@angular/core';
import { MainLayoutlState } from '../../states/main-layout.state';
import { MainSidebarNavItemComponent } from './components/main-sidebar-nav-item.component';
import { MainSidebarNavSeparatorComponent } from './components/main-sidebar-nav-separator.component';
import { DialogFacade } from '../../facades/dialog.facade';
import { GlobalModule } from '../../../core/modules/global-module.module';
import { PayableFormComponent } from '../../../features/financial/view/payable/payable-form/payable-form.component';
import { AuthState, UserData } from '../../states/auth.state';

@Component({
  selector: 'app-main-sidebar',
  imports: [GlobalModule, MainSidebarNavItemComponent, MainSidebarNavSeparatorComponent],
  templateUrl: './main-sidebar.component.html',
})
export class MainSidebarComponent implements OnInit {
  private authState: AuthState = inject(AuthState);
  userData: WritableSignal<UserData> = this.authState.userData;

  state: MainLayoutlState = inject(MainLayoutlState);
  dialogFacade: DialogFacade = inject(DialogFacade);

  active: boolean = false;
  hovering: boolean = false;

  ngOnInit() {
    this.state.active$.subscribe(active => this.active = active);
    this.state.hovering$.subscribe(hovering => this.hovering = hovering);
  };

  openSettings() {
    this.dialogFacade.open(PayableFormComponent, { header: "Configurações" }).closed$.subscribe(res => {})
  };
  
}
