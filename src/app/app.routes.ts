import { Routes } from '@angular/router';
import { authGuard } from './services/auth-guard';

export const routes: Routes = [

  {
    path: '',
    // redirectTo: () => {
    //   const token = sessionStorage.getItem('tkn');
    //   return token ? 'dashboard' : 'sign-in';
    // },  
    redirectTo:'dashboard',
    pathMatch: 'full'
  },

  {
    path: 'sign-in',
    loadComponent: () =>
      import('./pages/auth/sign-in/sign-in')
        .then(m => m.SignIn)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/auth/forgot-password/forgot-password')
        .then(m => m.ForgotPassword)
  },

  {
    path: '',
    // canActivate: [authGuard],
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
        path: 'team-members/:id',
        loadComponent: () =>
          import('./pages/team-member/components/team-member-details/team-member-details')
            .then(m => m.TeamMemberDetails)
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