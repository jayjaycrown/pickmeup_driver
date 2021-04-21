import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InboxPage } from './inbox.page';
// import { ViewInboxComponent } from './view-inbox/view-inbox.component';

const routes: Routes = [
  {
    path: '',
    component: InboxPage
  },
  // {
  //   path: ':id',
  //   loadChildren: () => import('./view-inbox/view-inbox.module').then( m => m.ViewInboxPageModule)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InboxPageRoutingModule {}
