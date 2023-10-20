import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SelectionCriteriaComponent } from '../list/selection-criteria.component';
import { SelectionCriteriaDetailComponent } from '../detail/selection-criteria-detail.component';
import { SelectionCriteriaUpdateComponent } from '../update/selection-criteria-update.component';
import { SelectionCriteriaRoutingResolveService } from './selection-criteria-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const selectionCriteriaRoute: Routes = [
  {
    path: '',
    component: SelectionCriteriaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SelectionCriteriaDetailComponent,
    resolve: {
      selectionCriteria: SelectionCriteriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SelectionCriteriaUpdateComponent,
    resolve: {
      selectionCriteria: SelectionCriteriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SelectionCriteriaUpdateComponent,
    resolve: {
      selectionCriteria: SelectionCriteriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(selectionCriteriaRoute)],
  exports: [RouterModule],
})
export class SelectionCriteriaRoutingModule {}
