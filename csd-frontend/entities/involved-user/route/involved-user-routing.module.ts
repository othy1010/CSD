import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InvolvedUserComponent } from '../list/involved-user.component';
import { InvolvedUserDetailComponent } from '../detail/involved-user-detail.component';
import { InvolvedUserUpdateComponent } from '../update/involved-user-update.component';
import { InvolvedUserRoutingResolveService } from './involved-user-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const involvedUserRoute: Routes = [
  {
    path: '',
    component: InvolvedUserComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InvolvedUserDetailComponent,
    resolve: {
      involvedUser: InvolvedUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InvolvedUserUpdateComponent,
    resolve: {
      involvedUser: InvolvedUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InvolvedUserUpdateComponent,
    resolve: {
      involvedUser: InvolvedUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(involvedUserRoute)],
  exports: [RouterModule],
})
export class InvolvedUserRoutingModule {}
