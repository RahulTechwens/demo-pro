import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyCalenderPage } from './my-calender.page';

const routes: Routes = [
  {
    path: '',
    component: MyCalenderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyCalenderPageRoutingModule {}
