import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const session = await authService.getSesionActual();

  if (session) {
    return true; // Tiene sesión, puede pasar
  } else {
    // No hay sesión, lo redirige al login
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }
};