import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProfileEditPageRoutingModule } from './profile-edit-routing.module';

import { ProfileEditPage } from './profile-edit.page';
import { ProfileComponent } from './profile/profile.component';
import { AddressComponent } from './address/address.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { QuillModule } from 'ngx-quill';
import { ImageCropperModule } from 'ngx-image-cropper';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ImageCropperModule,
    QuillModule,
    ProfileEditPageRoutingModule,
  ],
  declarations: [
    ProfileEditPage,
    ProfileComponent,
    AddressComponent,
    ChangePasswordComponent,
  ],
})
export class ProfileEditPageModule {}
