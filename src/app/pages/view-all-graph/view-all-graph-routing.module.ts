import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAllGraphPage } from './view-all-graph.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAllGraphPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAllGraphPageRoutingModule {}
