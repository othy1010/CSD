import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISolution, NewSolution } from '../solution.model';

export type PartialUpdateSolution = Partial<ISolution> & Pick<ISolution, 'id'>;

export type EntityResponseType = HttpResponse<ISolution>;
export type EntityArrayResponseType = HttpResponse<ISolution[]>;

@Injectable({ providedIn: 'root' })
export class SolutionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/solutions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(solution: NewSolution): Observable<EntityResponseType> {
    return this.http.post<ISolution>(this.resourceUrl, solution, { observe: 'response' });
  }

  update(solution: ISolution): Observable<EntityResponseType> {
    return this.http.put<ISolution>(`${this.resourceUrl}/${this.getSolutionIdentifier(solution)}`, solution, { observe: 'response' });
  }

  partialUpdate(solution: PartialUpdateSolution): Observable<EntityResponseType> {
    return this.http.patch<ISolution>(`${this.resourceUrl}/${this.getSolutionIdentifier(solution)}`, solution, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISolution>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISolution[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSolutionIdentifier(solution: Pick<ISolution, 'id'>): number {
    return solution.id;
  }

  compareSolution(o1: Pick<ISolution, 'id'> | null, o2: Pick<ISolution, 'id'> | null): boolean {
    return o1 && o2 ? this.getSolutionIdentifier(o1) === this.getSolutionIdentifier(o2) : o1 === o2;
  }

  addSolutionToCollectionIfMissing<Type extends Pick<ISolution, 'id'>>(
    solutionCollection: Type[],
    ...solutionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const solutions: Type[] = solutionsToCheck.filter(isPresent);
    if (solutions.length > 0) {
      const solutionCollectionIdentifiers = solutionCollection.map(solutionItem => this.getSolutionIdentifier(solutionItem)!);
      const solutionsToAdd = solutions.filter(solutionItem => {
        const solutionIdentifier = this.getSolutionIdentifier(solutionItem);
        if (solutionCollectionIdentifiers.includes(solutionIdentifier)) {
          return false;
        }
        solutionCollectionIdentifiers.push(solutionIdentifier);
        return true;
      });
      return [...solutionsToAdd, ...solutionCollection];
    }
    return solutionCollection;
  }
}
