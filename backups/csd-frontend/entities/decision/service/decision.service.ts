import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDecision, NewDecision } from '../decision.model';

export type PartialUpdateDecision = Partial<IDecision> & Pick<IDecision, 'id'>;

export type EntityResponseType = HttpResponse<IDecision>;
export type EntityArrayResponseType = HttpResponse<IDecision[]>;

@Injectable({ providedIn: 'root' })
export class DecisionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/decisions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(decision: NewDecision): Observable<EntityResponseType> {
    return this.http.post<IDecision>(this.resourceUrl, decision, { observe: 'response' });
  }

  update(decision: IDecision): Observable<EntityResponseType> {
    return this.http.put<IDecision>(`${this.resourceUrl}/${this.getDecisionIdentifier(decision)}`, decision, { observe: 'response' });
  }

  partialUpdate(decision: PartialUpdateDecision): Observable<EntityResponseType> {
    return this.http.patch<IDecision>(`${this.resourceUrl}/${this.getDecisionIdentifier(decision)}`, decision, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDecision>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDecision[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDecisionIdentifier(decision: Pick<IDecision, 'id'>): number {
    return decision.id;
  }

  compareDecision(o1: Pick<IDecision, 'id'> | null, o2: Pick<IDecision, 'id'> | null): boolean {
    return o1 && o2 ? this.getDecisionIdentifier(o1) === this.getDecisionIdentifier(o2) : o1 === o2;
  }

  addDecisionToCollectionIfMissing<Type extends Pick<IDecision, 'id'>>(
    decisionCollection: Type[],
    ...decisionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const decisions: Type[] = decisionsToCheck.filter(isPresent);
    if (decisions.length > 0) {
      const decisionCollectionIdentifiers = decisionCollection.map(decisionItem => this.getDecisionIdentifier(decisionItem)!);
      const decisionsToAdd = decisions.filter(decisionItem => {
        const decisionIdentifier = this.getDecisionIdentifier(decisionItem);
        if (decisionCollectionIdentifiers.includes(decisionIdentifier)) {
          return false;
        }
        decisionCollectionIdentifiers.push(decisionIdentifier);
        return true;
      });
      return [...decisionsToAdd, ...decisionCollection];
    }
    return decisionCollection;
  }
}
