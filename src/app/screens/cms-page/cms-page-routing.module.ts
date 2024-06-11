import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CmsPagePage } from './cms-page.page';

const routes: Routes = [
  {
    path: '',
    component: CmsPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CmsPagePageRoutingModule {}
