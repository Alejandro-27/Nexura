import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard'; 

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    canActivate: [authGuard] // <-- PROTECCIÓN: Si no hay sesión, rebota al login
  },
  {
    path: '',
    redirectTo: 'login', // <-- Por defecto al abrir la app, intentará ir a Login
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login' // Comodín por si se escribe cualquier otra ruta inexistente
  }
];