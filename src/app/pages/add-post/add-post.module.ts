import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPostPageRoutingModule } from './add-post-routing.module';
import { QuillModule } from 'ngx-quill';
import { AddPostPage } from './add-post.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    IonicModule,
    AddPostPageRoutingModule,
  ],
  declarations: [AddPostPage],
})
export class AddPostPageModule {}
