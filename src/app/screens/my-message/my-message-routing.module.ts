import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyMessagePage } from './my-message.page';

const routes: Routes = [
  {
    path: '',
    component: MyMessagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyMessagePageRoutingModule {}
