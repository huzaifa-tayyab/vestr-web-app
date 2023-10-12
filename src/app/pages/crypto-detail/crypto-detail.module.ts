import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CryptoDetailPageRoutingModule } from './crypto-detail-routing.module';
import { NgPipesModule } from 'ngx-pipes';
import { CryptoDetailPage } from './crypto-detail.page';
import { NewsComponent } from './news/news.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, FontAwesomeModule,
    IonicModule,  NgPipesModule, SharedModule,
    CryptoDetailPageRoutingModule
  ],
  declarations: [CryptoDetailPage, NewsComponent]
})
export class CryptoDetailPageModule {}
