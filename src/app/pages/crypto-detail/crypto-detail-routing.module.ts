import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CryptoDetailPage } from './crypto-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CryptoDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CryptoDetailPageRoutingModule {}
