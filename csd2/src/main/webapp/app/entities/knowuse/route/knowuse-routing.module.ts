import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { KnowuseComponent } from '../list/knowuse.component';
import { KnowuseDetailComponent } from '../detail/knowuse-detail.component';
import { KnowuseUpdateComponent } from '../update/knowuse-update.component';
import { KnowuseRoutingResolveService } from './knowuse-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const knowuseRoute: Routes = [
  {
    path: '',
    component: KnowuseComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: KnowuseDetailComponent,
    resolve: {
      knowuse: KnowuseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: KnowuseUpdateComponent,
    resolve: {
      knowuse: KnowuseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: KnowuseUpdateComponent,
    resolve: {
      knowuse: KnowuseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(knowuseRoute)],
  exports: [RouterModule],
})
export class KnowuseRoutingModule {}
