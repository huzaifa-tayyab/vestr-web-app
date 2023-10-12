import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAllStocksPage } from './view-all-stocks.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAllStocksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAllStocksPageRoutingModule {}
