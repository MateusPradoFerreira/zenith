
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../core/modules/global-module.module';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { UserData } from '../../../features/auth/models/user-data.model';
import { AuthFacade } from '../../../features/auth/facades/auth.facade';

@Component({
  selector: 'app-main-header',
  imports: [GlobalModule],
  templateUrl: './main-header.component.html',
})
export class MainHeaderComponent implements OnInit {
  authFacade = inject(AuthFacade);
  userData: WritableSignal<UserData> = this.authFacade.state.userData;

  route = inject(ActivatedRoute);
  router = inject(Router);

  header = signal<string>("Dashboard");

  ngOnInit(): void {
    this.handleGetRouteParams();
  };

  handleGetRouteParams() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route?.firstChild || this.route),
      mergeMap((route: ActivatedRoute) => route.data)
    ).subscribe((data: any) => {
      this.header.set(data["header"] || "Dashboard");
    });
  };
};