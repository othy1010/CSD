import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CodecisionMethodComponent } from '../list/codecision-method.component';
import { CodecisionMethodDetailComponent } from '../detail/codecision-method-detail.component';
import { CodecisionMethodUpdateComponent } from '../update/codecision-method-update.component';
import { CodecisionMethodRoutingResolveService } from './codecision-method-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const codecisionMethodRoute: Routes = [
  {
    path: '',
    component: CodecisionMethodComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CodecisionMethodDetailComponent,
    resolve: {
      codecisionMethod: CodecisionMethodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CodecisionMethodUpdateComponent,
    resolve: {
      codecisionMethod: CodecisionMethodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CodecisionMethodUpdateComponent,
    resolve: {
      codecisionMethod: CodecisionMethodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(codecisionMethodRoute)],
  exports: [RouterModule],
})
export class CodecisionMethodRoutingModule {}
