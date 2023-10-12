import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExplorePageRoutingModule } from './explore-routing.module';
import { NgPipesModule } from 'ngx-pipes';
import { ExplorePage } from './explore.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgPipesModule,
    IonicModule,
    ExplorePageRoutingModule,
  ],
  declarations: [ExplorePage],
})
export class ExplorePageModule {}
