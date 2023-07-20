import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChange, NewChange } from '../change.model';

export type PartialUpdateChange = Partial<IChange> & Pick<IChange, 'id'>;

export type EntityResponseType = HttpResponse<IChange>;
export type EntityArrayResponseType = HttpResponse<IChange[]>;

@Injectable({ providedIn: 'root' })
export class ChangeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/changes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(change: NewChange): Observable<EntityResponseType> {
    return this.http.post<IChange>(this.resourceUrl, change, { observe: 'response' });
  }

  update(change: IChange): Observable<EntityResponseType> {
    return this.http.put<IChange>(`${this.resourceUrl}/${this.getChangeIdentifier(change)}`, change, { observe: 'response' });
  }

  partialUpdate(change: PartialUpdateChange): Observable<EntityResponseType> {
    return this.http.patch<IChange>(`${this.resourceUrl}/${this.getChangeIdentifier(change)}`, change, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChange>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChange[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getChangeIdentifier(change: Pick<IChange, 'id'>): number {
    return change.id;
  }

  compareChange(o1: Pick<IChange, 'id'> | null, o2: Pick<IChange, 'id'> | null): boolean {
    return o1 && o2 ? this.getChangeIdentifier(o1) === this.getChangeIdentifier(o2) : o1 === o2;
  }

  addChangeToCollectionIfMissing<Type extends Pick<IChange, 'id'>>(
    changeCollection: Type[],
    ...changesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const changes: Type[] = changesToCheck.filter(isPresent);
    if (changes.length > 0) {
      const changeCollectionIdentifiers = changeCollection.map(changeItem => this.getChangeIdentifier(changeItem)!);
      const changesToAdd = changes.filter(changeItem => {
        const changeIdentifier = this.getChangeIdentifier(changeItem);
        if (changeCollectionIdentifiers.includes(changeIdentifier)) {
          return false;
        }
        changeCollectionIdentifiers.push(changeIdentifier);
        return true;
      });
      return [...changesToAdd, ...changeCollection];
    }
    return changeCollection;
  }
}
