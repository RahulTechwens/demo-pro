import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyMessagePageRoutingModule } from './my-message-routing.module';

import { MyMessagePage } from './my-message.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyMessagePageRoutingModule
  ],
  declarations: [MyMessagePage]
})
export class MyMessagePageModule {}
