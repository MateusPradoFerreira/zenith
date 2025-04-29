
import { Component } from '@angular/core';
import { GlobalModule } from '../../../core/modules/global-module.module';

@Component({
  selector: 'app-main-header',
  imports: [GlobalModule],
  templateUrl: './main-header.component.html',
})
export class MainHeaderComponent {}
