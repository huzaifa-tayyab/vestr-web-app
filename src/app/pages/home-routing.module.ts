import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { content } from './routes';
const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: content,
  },
  {
    path: 'transaction-details',
    loadChildren: () => import('./transaction-details/transaction-details.module').then( m => m.TransactionDetailsPageModule)
  },
  // {
  //   path: 'draft',
  //   loadChildren: () => import('./draft/draft.module').then( m => m.DraftPageModule)
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
