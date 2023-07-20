import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProposal } from '../proposal.model';
import { ProposalService } from '../service/proposal.service';

@Injectable({ providedIn: 'root' })
export class ProposalRoutingResolveService implements Resolve<IProposal | null> {
  constructor(protected service: ProposalService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProposal | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((proposal: HttpResponse<IProposal>) => {
          if (proposal.body) {
            return of(proposal.body);
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
