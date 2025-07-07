import { Component } from '@angular/core';
import { GlobalModule } from '../../../../core/modules/global-module.module';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [GlobalModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {};