import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDecisionPattern, NewDecisionPattern } from '../decision-pattern.model';

export type PartialUpdateDecisionPattern = Partial<IDecisionPattern> & Pick<IDecisionPattern, 'id'>;

export type EntityResponseType = HttpResponse<IDecisionPattern>;
export type EntityArrayResponseType = HttpResponse<IDecisionPattern[]>;

@Injectable({ providedIn: 'root' })
export class DecisionPatternService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/decision-patterns');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(decisionPattern: NewDecisionPattern): Observable<EntityResponseType> {
    return this.http.post<IDecisionPattern>(this.resourceUrl, decisionPattern, { observe: 'response' });
  }

  update(decisionPattern: IDecisionPattern): Observable<EntityResponseType> {
    return this.http.put<IDecisionPattern>(`${this.resourceUrl}/${this.getDecisionPatternIdentifier(decisionPattern)}`, decisionPattern, {
      observe: 'response',
    });
  }

  partialUpdate(decisionPattern: PartialUpdateDecisionPattern): Observable<EntityResponseType> {
    return this.http.patch<IDecisionPattern>(`${this.resourceUrl}/${this.getDecisionPatternIdentifier(decisionPattern)}`, decisionPattern, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDecisionPattern>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDecisionPattern[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDecisionPatternIdentifier(decisionPattern: Pick<IDecisionPattern, 'id'>): number {
    return decisionPattern.id;
  }

  compareDecisionPattern(o1: Pick<IDecisionPattern, 'id'> | null, o2: Pick<IDecisionPattern, 'id'> | null): boolean {
    return o1 && o2 ? this.getDecisionPatternIdentifier(o1) === this.getDecisionPatternIdentifier(o2) : o1 === o2;
  }

  addDecisionPatternToCollectionIfMissing<Type extends Pick<IDecisionPattern, 'id'>>(
    decisionPatternCollection: Type[],
    ...decisionPatternsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const decisionPatterns: Type[] = decisionPatternsToCheck.filter(isPresent);
    if (decisionPatterns.length > 0) {
      const decisionPatternCollectionIdentifiers = decisionPatternCollection.map(
        decisionPatternItem => this.getDecisionPatternIdentifier(decisionPatternItem)!
      );
      const decisionPatternsToAdd = decisionPatterns.filter(decisionPatternItem => {
        const decisionPatternIdentifier = this.getDecisionPatternIdentifier(decisionPatternItem);
        if (decisionPatternCollectionIdentifiers.includes(decisionPatternIdentifier)) {
          return false;
        }
        decisionPatternCollectionIdentifiers.push(decisionPatternIdentifier);
        return true;
      });
      return [...decisionPatternsToAdd, ...decisionPatternCollection];
    }
    return decisionPatternCollection;
  }
}
