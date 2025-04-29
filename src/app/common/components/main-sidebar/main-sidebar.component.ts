
import { Component, inject, OnInit } from '@angular/core';
import { MainLayoutlState } from '../../states/main-layout.state';
import { MainSidebarNavItemComponent } from './components/main-sidebar-nav-item.component';
import { MainSidebarNavSeparatorComponent } from './components/main-sidebar-nav-separator.component';
import { DialogFacade } from '../../facades/dialog.facade';
import { DashboardComponent } from '../../../features/dashboard/view/dashboard/dashboard.component';
import { GlobalModule } from '../../../core/modules/global-module.module';

@Component({
  selector: 'app-main-sidebar',
  imports: [GlobalModule, MainSidebarNavItemComponent, MainSidebarNavSeparatorComponent],
  templateUrl: './main-sidebar.component.html',
})
export class MainSidebarComponent implements OnInit {
  state: MainLayoutlState = inject(MainLayoutlState);
  dialogFacade: DialogFacade = inject(DialogFacade);

  active: boolean = false;
  hovering: boolean = false;

  ngOnInit() {
    this.state.active$.subscribe(active => this.active = active);
    this.state.hovering$.subscribe(hovering => this.hovering = hovering);
  };

  openSettings() {
    this.dialogFacade.open(DashboardComponent, { header: "Configurações" }).closed$.subscribe(res => {})
  };
  
}
