
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayoutlState } from '../../states/main-layout.state';
import { MainSidebarComponent } from '../../components/main-sidebar/main-sidebar.component';
import { GlobalModule } from '../../../core/modules/global-module.module';
import { MainHeaderComponent } from '../../components/main-header/main-header.component';

@Component({
  selector: 'app-main-layout',
  imports: [GlobalModule, RouterOutlet, MainSidebarComponent, MainHeaderComponent],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent implements OnInit {
  state = inject(MainLayoutlState);
  active: boolean = false;

  ngOnInit() {
    this.state.active$.subscribe(active => this.active = active);
  };
  
}
