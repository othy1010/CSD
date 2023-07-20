import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIntent } from '../intent.model';
import { IntentService } from '../service/intent.service';

@Injectable({ providedIn: 'root' })
export class IntentRoutingResolveService implements Resolve<IIntent | null> {
  constructor(protected service: IntentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IIntent | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((intent: HttpResponse<IIntent>) => {
          if (intent.body) {
            return of(intent.body);
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
