import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISolution } from '../solution.model';
import { SolutionService } from '../service/solution.service';

@Injectable({ providedIn: 'root' })
export class SolutionRoutingResolveService implements Resolve<ISolution | null> {
  constructor(protected service: SolutionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISolution | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((solution: HttpResponse<ISolution>) => {
          if (solution.body) {
            return of(solution.body);
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
