import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SucessPagePage } from './sucess-page.page';

const routes: Routes = [
  {
    path: '',
    component: SucessPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SucessPagePageRoutingModule {}
