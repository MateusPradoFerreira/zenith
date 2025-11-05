import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MockDataService } from './common/services/mock-data.service';
import { environment } from '../environments/environment';
import { GlobalModule } from './core/modules/global-module.module';

@Component({
  selector: 'app-root',
  imports: [GlobalModule, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  mockDataService = inject(MockDataService);

  ngOnInit() {
    if(environment.environment === "development") this.mockDataService.initMockedData()
  };

};
