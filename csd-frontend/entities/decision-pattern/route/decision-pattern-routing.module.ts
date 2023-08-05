import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DecisionPatternComponent } from '../list/decision-pattern.component';
import { DecisionPatternDetailComponent } from '../detail/decision-pattern-detail.component';
import { DecisionPatternUpdateComponent } from '../update/decision-pattern-update.component';
import { DecisionPatternRoutingResolveService } from './decision-pattern-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const decisionPatternRoute: Routes = [
  {
    path: '',
    component: DecisionPatternComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DecisionPatternDetailComponent,
    resolve: {
      decisionPattern: DecisionPatternRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DecisionPatternUpdateComponent,
    resolve: {
      decisionPattern: DecisionPatternRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DecisionPatternUpdateComponent,
    resolve: {
      decisionPattern: DecisionPatternRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(decisionPatternRoute)],
  exports: [RouterModule],
})
export class DecisionPatternRoutingModule {}
