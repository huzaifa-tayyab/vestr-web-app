import { Routes } from '@angular/router';
import { UnAuthguardGuard } from './unauthguard.guard';

export const content: Routes = [
  {
    path: 'feed',
    canActivate: [UnAuthguardGuard],
    loadChildren: () =>
      import('../pages/main/main.module').then((m) => m.MainPageModule),
  },
  {
    path: 'post-detail/:id',
    canActivate: [UnAuthguardGuard],
    loadChildren: () =>
      import('../pages/post-detail/post-detail.module').then(
        (m) => m.PostDetailPageModule
      ),
  },
  {
    path: 'news',
    canActivate: [UnAuthguardGuard],
    loadChildren: () =>
      import('../pages/news/news.module').then((m) => m.NewsPageModule),
  },
  {
    path: 'profile/:id',
    canActivate: [UnAuthguardGuard],
    loadChildren: () =>
      import('../pages/other-profile/other-profile.module').then(
        (m) => m.OtherProfilePageModule
      ),
  },
  {
    path: 'markets',
    canActivate: [UnAuthguardGuard],
    loadChildren: () =>
      import('../pages/market/market.module').then((m) => m.MarketPageModule),
  },
  {
    path: 'market-detail/:id',
    canActivate: [UnAuthguardGuard],
    loadChildren: () =>
      import('../pages/market-detail/market-detail.module').then(
        (m) => m.MarketDetailPageModule
      ),
  },
  {
    path: 'crypto-detail/:id/:doolar',
    canActivate: [UnAuthguardGuard],
    loadChildren: () =>
      import('../pages/crypto-detail/crypto-detail.module').then(
        (m) => m.CryptoDetailPageModule
      ),
  },
  {
    path: 'rooms',
    loadChildren: () =>
      import('../pages/rooms/rooms.module').then((m) => m.RoomsPageModule),
  },
  {
    path: 'rooms/:id',
    loadChildren: () =>
      import('../pages/rooms/rooms.module').then((m) => m.RoomsPageModule),
  },
  {
    path: 'home',
    canActivate: [UnAuthguardGuard],
    loadChildren: () =>
      import('../pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'explore',
    canActivate: [UnAuthguardGuard],
    loadChildren: () =>
      import('../pages/explore/explore.module').then(
        (m) => m.ExplorePageModule
      ),
  },
  {
    path: 'login',
    canActivate: [UnAuthguardGuard],
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'signup',
    canActivate: [UnAuthguardGuard],
    loadChildren: () =>
      import('./signup/signup.module').then((m) => m.SignupPageModule),
  },
  {
    path: 'otp',
    canActivate: [UnAuthguardGuard],
    loadChildren: () => import('./otp/otp.module').then((m) => m.OtpPageModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
  {
    path: 'forgot-password/:user_uid/:otp',
    loadChildren: () =>
      import('./forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
  {
    path: '**',
    redirectTo: 'feed',
  },
];
