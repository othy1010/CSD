import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICollaboration } from '../collaboration.model';
import { CollaborationService } from '../service/collaboration.service';

@Injectable({ providedIn: 'root' })
export class CollaborationRoutingResolveService implements Resolve<ICollaboration | null> {
  constructor(protected service: CollaborationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICollaboration | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((collaboration: HttpResponse<ICollaboration>) => {
          if (collaboration.body) {
            return of(collaboration.body);
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
