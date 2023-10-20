import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IParticipationMethod } from '../participation-method.model';
import { ParticipationMethodService } from '../service/participation-method.service';

@Injectable({ providedIn: 'root' })
export class ParticipationMethodRoutingResolveService implements Resolve<IParticipationMethod | null> {
  constructor(protected service: ParticipationMethodService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParticipationMethod | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((participationMethod: HttpResponse<IParticipationMethod>) => {
          if (participationMethod.body) {
            return of(participationMethod.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
