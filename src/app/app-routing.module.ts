import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UnAuthguardGuard } from './auth/unauthguard.guard';
import { AuthguardGuard } from './auth/authguard.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [UnAuthguardGuard],
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'signup',
    canActivate: [UnAuthguardGuard],
    loadChildren: () =>
      import('./auth/signup/signup.module').then((m) => m.SignupPageModule),
  },
  {
    path: 'otp',
    canActivate: [UnAuthguardGuard],
    loadChildren: () =>
      import('./auth/otp/otp.module').then((m) => m.OtpPageModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./auth/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
  {
    path: 'forgot-password/:user_uid/:otp',
    loadChildren: () =>
      import('./auth/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
  {
    path: 'app',
    canActivate: [AuthguardGuard],
    loadChildren: () =>
      import('./pages/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'feed',
    canActivate: [UnAuthguardGuard],
    loadChildren: () =>
      import('./pages/main/main.module').then((m) => m.MainPageModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./auth/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
