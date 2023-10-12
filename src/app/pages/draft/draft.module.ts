import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { DraftPageRoutingModule } from "./draft-routing.module";

import { DraftPage } from "./draft.page";
import { SharedModule } from "src/app/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    DraftPageRoutingModule,
  ],
  declarations: [DraftPage],
})
export class DraftPageModule {}
