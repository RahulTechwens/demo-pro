import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddConsultationChargePage } from './add-consultation-charge.page';

const routes: Routes = [
  {
    path: '',
    component: AddConsultationChargePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddConsultationChargePageRoutingModule {}
