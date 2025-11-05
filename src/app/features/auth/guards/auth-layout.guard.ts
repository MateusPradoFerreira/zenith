import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFacade } from '../facades/auth.facade';

export const authLayoutGuard: CanActivateFn = () => {
  const facade = inject(AuthFacade);
  const router = inject(Router);

  if (facade.state.isLoggedIn()) {
    router.navigate(['/dashboard']);
    return false;
  };

  return true;
};