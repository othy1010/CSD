import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ThreatComponent } from '../list/threat.component';
import { ThreatDetailComponent } from '../detail/threat-detail.component';
import { ThreatUpdateComponent } from '../update/threat-update.component';
import { ThreatRoutingResolveService } from './threat-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const threatRoute: Routes = [
  {
    path: '',
    component: ThreatComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ThreatDetailComponent,
    resolve: {
      threat: ThreatRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ThreatUpdateComponent,
    resolve: {
      threat: ThreatRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ThreatUpdateComponent,
    resolve: {
      threat: ThreatRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(threatRoute)],
  exports: [RouterModule],
})
export class ThreatRoutingModule {}
