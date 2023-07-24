import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IKnowuse } from '../knowuse.model';
import { KnowuseService } from '../service/knowuse.service';

@Injectable({ providedIn: 'root' })
export class KnowuseRoutingResolveService implements Resolve<IKnowuse | null> {
  constructor(protected service: KnowuseService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IKnowuse | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((knowuse: HttpResponse<IKnowuse>) => {
          if (knowuse.body) {
            return of(knowuse.body);
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
