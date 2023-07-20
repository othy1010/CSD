import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ParticipationMethodComponent } from '../list/participation-method.component';
import { ParticipationMethodDetailComponent } from '../detail/participation-method-detail.component';
import { ParticipationMethodUpdateComponent } from '../update/participation-method-update.component';
import { ParticipationMethodRoutingResolveService } from './participation-method-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const participationMethodRoute: Routes = [
  {
    path: '',
    component: ParticipationMethodComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParticipationMethodDetailComponent,
    resolve: {
      participationMethod: ParticipationMethodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParticipationMethodUpdateComponent,
    resolve: {
      participationMethod: ParticipationMethodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParticipationMethodUpdateComponent,
    resolve: {
      participationMethod: ParticipationMethodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(participationMethodRoute)],
  exports: [RouterModule],
})
export class ParticipationMethodRoutingModule {}
