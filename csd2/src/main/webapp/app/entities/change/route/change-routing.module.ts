import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChangeComponent } from '../list/change.component';
import { ChangeDetailComponent } from '../detail/change-detail.component';
import { ChangeUpdateComponent } from '../update/change-update.component';
import { ChangeRoutingResolveService } from './change-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const changeRoute: Routes = [
  {
    path: '',
    component: ChangeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChangeDetailComponent,
    resolve: {
      change: ChangeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChangeUpdateComponent,
    resolve: {
      change: ChangeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChangeUpdateComponent,
    resolve: {
      change: ChangeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(changeRoute)],
  exports: [RouterModule],
})
export class ChangeRoutingModule {}
