import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AditionalDetailsPage } from './aditional-details.page';

const routes: Routes = [
  {
    path: '',
    component: AditionalDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AditionalDetailsPageRoutingModule {}
