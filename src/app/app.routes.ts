import { Routes } from '@angular/router';

export const routes: Routes = [
      {
        path: 'sign-in',
        loadComponent: () =>
          import('./pages/dashboard/auth/sign-in/sign-in')
            .then(m => m.SignIn)
      },
  {
    path: '',
    loadComponent: () =>
      import('./layout/dashboard-layout/dashboard-layout')
        .then(m => m.DashboardLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard')
            .then(m => m.Dashboard)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile')
            .then(m => m.Profile)
      },
      
    ]
  }
];