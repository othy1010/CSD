import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SolutionComponent } from '../list/solution.component';
import { SolutionDetailComponent } from '../detail/solution-detail.component';
import { SolutionUpdateComponent } from '../update/solution-update.component';
import { SolutionRoutingResolveService } from './solution-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const solutionRoute: Routes = [
  {
    path: '',
    component: SolutionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SolutionDetailComponent,
    resolve: {
      solution: SolutionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SolutionUpdateComponent,
    resolve: {
      solution: SolutionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SolutionUpdateComponent,
    resolve: {
      solution: SolutionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(solutionRoute)],
  exports: [RouterModule],
})
export class SolutionRoutingModule {}
