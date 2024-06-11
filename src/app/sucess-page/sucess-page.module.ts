import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SucessPagePageRoutingModule } from './sucess-page-routing.module';

import { SucessPagePage } from './sucess-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SucessPagePageRoutingModule
  ],
  declarations: [SucessPagePage]
})
export class SucessPagePageModule {}
