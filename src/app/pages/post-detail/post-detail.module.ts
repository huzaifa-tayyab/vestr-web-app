import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostDetailPageRoutingModule } from './post-detail-routing.module';

import { PostDetailPage } from './post-detail.page';
import { SharedModule } from 'src/app/shared.module';
import { NgPipesModule } from 'ngx-pipes';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FontAwesomeModule,
    FormsModule,
    IonicModule,
    NgPipesModule,
    PostDetailPageRoutingModule,
  ],
  declarations: [PostDetailPage],
})
export class PostDetailPageModule {}
