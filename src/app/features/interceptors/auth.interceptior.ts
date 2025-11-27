import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthFacade } from '../auth/facades/auth.facade';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private facade = inject(AuthFacade);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.facade.state.userToken();
    if (!token) return next.handle(req);
    const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` }});
    return next.handle(cloned);
  };
};