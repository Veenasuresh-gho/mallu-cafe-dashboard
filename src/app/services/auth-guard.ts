import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const token = sessionStorage.getItem('tkn');

  if (token) {
    return true;
  } else {
    router.navigate(['/sign-in'], { replaceUrl: true });
    return false;
  }
};