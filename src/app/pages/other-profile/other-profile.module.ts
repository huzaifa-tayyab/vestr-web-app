import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { IonicModule } from '@ionic/angular';

import { OtherProfilePageRoutingModule } from './other-profile-routing.module';

import { OtherProfilePage } from './other-profile.page';

@NgModule({
  imports: [
    CommonModule, SharedModule,
    FormsModule,
    IonicModule,
    OtherProfilePageRoutingModule
  ],
  declarations: [OtherProfilePage]
})
export class OtherProfilePageModule {}
