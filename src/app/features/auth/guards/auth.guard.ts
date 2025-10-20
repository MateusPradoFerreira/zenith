import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFacade } from '../facades/auth.facade';

export const authGuard: CanActivateFn = () => {
  const facade = inject(AuthFacade);
  const router = inject(Router);

  if (!facade.state.isLoggedIn()) {
    router.navigate(['/auth/sign-in']);
    return false;
  };

  return true;
};