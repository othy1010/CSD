import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChange } from '../change.model';
import { ChangeService } from '../service/change.service';

@Injectable({ providedIn: 'root' })
export class ChangeRoutingResolveService implements Resolve<IChange | null> {
  constructor(protected service: ChangeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChange | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((change: HttpResponse<IChange>) => {
          if (change.body) {
            return of(change.body);
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
