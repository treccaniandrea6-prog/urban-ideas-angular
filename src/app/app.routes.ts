import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  {
    path: 'login',
    loadComponent: () => import('./pages/login').then(m => m.LoginComponent),
  },

  // ✅ TORNA COME PRIMA: HOME come contenitore (tabs, logout, ecc.)
  {
    path: 'users',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home').then(m => m.HomeComponent),
  },

  {
    path: 'users/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/user-detail').then(m => m.UserDetailComponent),
  },

  {
    path: 'posts',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/posts').then(m => m.PostsComponent),
  },

  // opzionale: se vuoi mantenerlo
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home').then(m => m.HomeComponent),
  },

  { path: '**', redirectTo: 'login' },
];
