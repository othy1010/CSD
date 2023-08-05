import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CollaborationComponent } from '../list/collaboration.component';
import { CollaborationDetailComponent } from '../detail/collaboration-detail.component';
import { CollaborationUpdateComponent } from '../update/collaboration-update.component';
import { CollaborationRoutingResolveService } from './collaboration-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const collaborationRoute: Routes = [
  {
    path: '',
    component: CollaborationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CollaborationDetailComponent,
    resolve: {
      collaboration: CollaborationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CollaborationUpdateComponent,
    resolve: {
      collaboration: CollaborationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CollaborationUpdateComponent,
    resolve: {
      collaboration: CollaborationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(collaborationRoute)],
  exports: [RouterModule],
})
export class CollaborationRoutingModule {}
