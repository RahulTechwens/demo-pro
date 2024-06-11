import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, NavParams } from '@ionic/angular';

import { CmsPagePageRoutingModule } from './cms-page-routing.module';

import { CmsPagePage } from './cms-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CmsPagePageRoutingModule
  ],
  declarations: [CmsPagePage],
  providers: [NavParams]
})
export class CmsPagePageModule {}
