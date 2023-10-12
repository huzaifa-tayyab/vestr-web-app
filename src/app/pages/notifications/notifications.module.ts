import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { NotificationsPageRoutingModule } from "./notifications-routing.module";

import { NotificationsPage } from "./notifications.page";
import { AllComponent } from "./all/all.component";
import { NgPipesModule } from "ngx-pipes";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgPipesModule,
    IonicModule,
    NotificationsPageRoutingModule,
  ],
  declarations: [NotificationsPage, AllComponent],
})
export class NotificationsPageModule {}
