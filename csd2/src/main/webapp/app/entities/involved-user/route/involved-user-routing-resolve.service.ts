import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInvolvedUser } from '../involved-user.model';
import { InvolvedUserService } from '../service/involved-user.service';

@Injectable({ providedIn: 'root' })
export class InvolvedUserRoutingResolveService implements Resolve<IInvolvedUser | null> {
  constructor(protected service: InvolvedUserService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInvolvedUser | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((involvedUser: HttpResponse<IInvolvedUser>) => {
          if (involvedUser.body) {
            return of(involvedUser.body);
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
