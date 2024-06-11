import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JoinPagePageRoutingModule } from './join-page-routing.module';

import { JoinPagePage } from './join-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JoinPagePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [JoinPagePage]
})
export class JoinPagePageModule {}
