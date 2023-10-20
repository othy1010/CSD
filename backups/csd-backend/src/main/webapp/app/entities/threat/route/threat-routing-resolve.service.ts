import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IThreat } from '../threat.model';
import { ThreatService } from '../service/threat.service';

@Injectable({ providedIn: 'root' })
export class ThreatRoutingResolveService implements Resolve<IThreat | null> {
  constructor(protected service: ThreatService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IThreat | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((threat: HttpResponse<IThreat>) => {
          if (threat.body) {
            return of(threat.body);
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
