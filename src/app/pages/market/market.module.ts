import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarketPageRoutingModule } from './market-routing.module';

import { MarketPage } from './market.page';
import { SharedModule } from 'src/app/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    MarketPageRoutingModule,
  ],
  declarations: [MarketPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MarketPageModule {}
