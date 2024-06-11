import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyLeavePage } from './my-leave.page';

const routes: Routes = [
  {
    path: '',
    component: MyLeavePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyLeavePageRoutingModule {}
