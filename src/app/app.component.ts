import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthFacade } from './features/auth/facades/auth.facade';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  authFacade = inject(AuthFacade);

  ngOnInit(): void {
    this.authFacade.validateAuth();
  };
};
