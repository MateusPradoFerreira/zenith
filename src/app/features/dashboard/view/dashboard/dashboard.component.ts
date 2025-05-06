import { Component, OnInit } from '@angular/core';
import { GlobalModule } from '../../../../core/modules/global-module.module';

@Component({
  selector: 'app-dashboard',
  imports: [GlobalModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  async ngOnInit() {};
}
