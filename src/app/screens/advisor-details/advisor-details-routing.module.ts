import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvisorDetailsPage } from './advisor-details.page';

const routes: Routes = [
  {
    path: '',
    component: AdvisorDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvisorDetailsPageRoutingModule {}
