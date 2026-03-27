import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'sign-in',
    loadComponent: () =>
      import('./pages/dashboard/auth/sign-in/sign-in')
        .then(m => m.SignIn)
  },
    {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/dashboard/auth/forgot-password/forgot-password')
        .then(m => m.ForgotPassword)
  },
      {
    path: 'set-new-password',
    loadComponent: () =>
      import('./pages/dashboard/auth/set-new-password/set-new-password')
        .then(m => m.SetNewPassword)
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
      {
        path: 'programs',
        loadComponent: () =>
          import('./pages/programs/programs')
            .then(m => m.Programs)
      },
      {
        path: 'media-library',
        loadComponent: () =>
          import('./pages/media-library/media-library')
            .then(m => m.MediaLibrary)
      },
      {
        path: 'team-members',
        loadComponent: () =>
          import('./pages/team-member/team-member')
            .then(m => m.TeamMember)
      },
      {
        path: 'advertisements',
        loadComponent: () =>
          import('./pages/advertisements/advertisements')
            .then(m => m.Advertisements)
      },

    ]
  }
];