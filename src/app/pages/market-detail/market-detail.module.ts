import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarketDetailPageRoutingModule } from './market-detail-routing.module';

import { MarketDetailPage } from './market-detail.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NewsComponent } from './news/news.component';
import { NgPipesModule } from 'ngx-pipes';
import { HighchartsChartModule } from 'highcharts-angular';
import { SharedModule } from 'src/app/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule, FontAwesomeModule, HighchartsChartModule,
    IonicModule,  NgPipesModule, SharedModule,
    MarketDetailPageRoutingModule
  ],
  declarations: [MarketDetailPage, NewsComponent]
})
export class MarketDetailPageModule {}
