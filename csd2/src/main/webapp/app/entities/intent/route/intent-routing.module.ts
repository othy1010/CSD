import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IntentComponent } from '../list/intent.component';
import { IntentDetailComponent } from '../detail/intent-detail.component';
import { IntentUpdateComponent } from '../update/intent-update.component';
import { IntentRoutingResolveService } from './intent-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const intentRoute: Routes = [
  {
    path: '',
    component: IntentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IntentDetailComponent,
    resolve: {
      intent: IntentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IntentUpdateComponent,
    resolve: {
      intent: IntentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IntentUpdateComponent,
    resolve: {
      intent: IntentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(intentRoute)],
  exports: [RouterModule],
})
export class IntentRoutingModule {}
