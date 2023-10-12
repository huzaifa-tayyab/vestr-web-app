import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewAllStocksPageRoutingModule } from './view-all-stocks-routing.module';

import { ViewAllStocksPage } from './view-all-stocks.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewAllStocksPageRoutingModule
  ],
  declarations: [ViewAllStocksPage]
})
export class ViewAllStocksPageModule {}
