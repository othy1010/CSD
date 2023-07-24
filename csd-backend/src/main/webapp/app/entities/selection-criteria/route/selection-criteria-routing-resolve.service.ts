import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISelectionCriteria } from '../selection-criteria.model';
import { SelectionCriteriaService } from '../service/selection-criteria.service';

@Injectable({ providedIn: 'root' })
export class SelectionCriteriaRoutingResolveService implements Resolve<ISelectionCriteria | null> {
  constructor(protected service: SelectionCriteriaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISelectionCriteria | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((selectionCriteria: HttpResponse<ISelectionCriteria>) => {
          if (selectionCriteria.body) {
            return of(selectionCriteria.body);
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
