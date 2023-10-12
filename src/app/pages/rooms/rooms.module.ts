import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RoomsPageRoutingModule } from './rooms-routing.module';
import { NgPipesModule } from 'ngx-pipes';
import { RoomsPage } from './rooms.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChatRoomComponent } from './chat-room/chat-room.component';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    IonicModule,
    NgPipesModule,
    RoomsPageRoutingModule,
  ],
  declarations: [RoomsPage, ChatRoomComponent],
})
export class RoomsPageModule {}
