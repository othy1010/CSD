import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDecisionPattern } from '../decision-pattern.model';
import { DecisionPatternService } from '../service/decision-pattern.service';

@Injectable({ providedIn: 'root' })
export class DecisionPatternRoutingResolveService implements Resolve<IDecisionPattern | null> {
  constructor(protected service: DecisionPatternService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDecisionPattern | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((decisionPattern: HttpResponse<IDecisionPattern>) => {
          if (decisionPattern.body) {
            return of(decisionPattern.body);
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
