import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISelectionCriteria, NewSelectionCriteria } from '../selection-criteria.model';

export type PartialUpdateSelectionCriteria = Partial<ISelectionCriteria> & Pick<ISelectionCriteria, 'id'>;

export type EntityResponseType = HttpResponse<ISelectionCriteria>;
export type EntityArrayResponseType = HttpResponse<ISelectionCriteria[]>;

@Injectable({ providedIn: 'root' })
export class SelectionCriteriaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/selection-criteria');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(selectionCriteria: NewSelectionCriteria): Observable<EntityResponseType> {
    return this.http.post<ISelectionCriteria>(this.resourceUrl, selectionCriteria, { observe: 'response' });
  }

  update(selectionCriteria: ISelectionCriteria): Observable<EntityResponseType> {
    return this.http.put<ISelectionCriteria>(
      `${this.resourceUrl}/${this.getSelectionCriteriaIdentifier(selectionCriteria)}`,
      selectionCriteria,
      { observe: 'response' }
    );
  }

  partialUpdate(selectionCriteria: PartialUpdateSelectionCriteria): Observable<EntityResponseType> {
    return this.http.patch<ISelectionCriteria>(
      `${this.resourceUrl}/${this.getSelectionCriteriaIdentifier(selectionCriteria)}`,
      selectionCriteria,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISelectionCriteria>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISelectionCriteria[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSelectionCriteriaIdentifier(selectionCriteria: Pick<ISelectionCriteria, 'id'>): number {
    return selectionCriteria.id;
  }

  compareSelectionCriteria(o1: Pick<ISelectionCriteria, 'id'> | null, o2: Pick<ISelectionCriteria, 'id'> | null): boolean {
    return o1 && o2 ? this.getSelectionCriteriaIdentifier(o1) === this.getSelectionCriteriaIdentifier(o2) : o1 === o2;
  }

  addSelectionCriteriaToCollectionIfMissing<Type extends Pick<ISelectionCriteria, 'id'>>(
    selectionCriteriaCollection: Type[],
    ...selectionCriteriaToCheck: (Type | null | undefined)[]
  ): Type[] {
    const selectionCriteria: Type[] = selectionCriteriaToCheck.filter(isPresent);
    if (selectionCriteria.length > 0) {
      const selectionCriteriaCollectionIdentifiers = selectionCriteriaCollection.map(
        selectionCriteriaItem => this.getSelectionCriteriaIdentifier(selectionCriteriaItem)!
      );
      const selectionCriteriaToAdd = selectionCriteria.filter(selectionCriteriaItem => {
        const selectionCriteriaIdentifier = this.getSelectionCriteriaIdentifier(selectionCriteriaItem);
        if (selectionCriteriaCollectionIdentifiers.includes(selectionCriteriaIdentifier)) {
          return false;
        }
        selectionCriteriaCollectionIdentifiers.push(selectionCriteriaIdentifier);
        return true;
      });
      return [...selectionCriteriaToAdd, ...selectionCriteriaCollection];
    }
    return selectionCriteriaCollection;
  }
}
