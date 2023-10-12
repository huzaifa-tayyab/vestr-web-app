import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewAllGraphPageRoutingModule } from './view-all-graph-routing.module';

import { ViewAllGraphPage } from './view-all-graph.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, SharedModule,
    IonicModule,
    ViewAllGraphPageRoutingModule
  ],
  declarations: [ViewAllGraphPage]
})
export class ViewAllGraphPageModule {}
