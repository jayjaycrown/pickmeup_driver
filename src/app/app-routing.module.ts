import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';
// import { AuthGuard } from './_helpers/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canLoad: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  // {
  //   path: '**',
  //   redirectTo: 'auth',
  //   pathMatch: 'full'
  // },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthPageModule),
    canLoad: [AutoLoginGuard]
  },
  // {
  //   path: 'test',
  //   loadChildren: () => import('./test/test.module').then(m => m.TestPageModule),
  //   canLoad: [AuthGuard]
  // },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'inbox',
    loadChildren: () => import('./inbox/inbox.module').then(m => m.InboxPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'wallet-history',
    loadChildren: () => import('./wallet-history/wallet-history.module').then(m => m.WalletHistoryPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'privacy',
    loadChildren: () => import('./privacy/privacy.module').then(m => m.PrivacyPageModule),
    canLoad: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
