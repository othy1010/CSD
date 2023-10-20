import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInvolvedUser, NewInvolvedUser } from '../involved-user.model';

export type PartialUpdateInvolvedUser = Partial<IInvolvedUser> & Pick<IInvolvedUser, 'id'>;

export type EntityResponseType = HttpResponse<IInvolvedUser>;
export type EntityArrayResponseType = HttpResponse<IInvolvedUser[]>;

@Injectable({ providedIn: 'root' })
export class InvolvedUserService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/involved-users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(involvedUser: NewInvolvedUser): Observable<EntityResponseType> {
    return this.http.post<IInvolvedUser>(this.resourceUrl, involvedUser, { observe: 'response' });
  }

  update(involvedUser: IInvolvedUser): Observable<EntityResponseType> {
    return this.http.put<IInvolvedUser>(`${this.resourceUrl}/${this.getInvolvedUserIdentifier(involvedUser)}`, involvedUser, {
      observe: 'response',
    });
  }

  partialUpdate(involvedUser: PartialUpdateInvolvedUser): Observable<EntityResponseType> {
    return this.http.patch<IInvolvedUser>(`${this.resourceUrl}/${this.getInvolvedUserIdentifier(involvedUser)}`, involvedUser, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInvolvedUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInvolvedUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInvolvedUserIdentifier(involvedUser: Pick<IInvolvedUser, 'id'>): number {
    return involvedUser.id;
  }

  compareInvolvedUser(o1: Pick<IInvolvedUser, 'id'> | null, o2: Pick<IInvolvedUser, 'id'> | null): boolean {
    return o1 && o2 ? this.getInvolvedUserIdentifier(o1) === this.getInvolvedUserIdentifier(o2) : o1 === o2;
  }

  addInvolvedUserToCollectionIfMissing<Type extends Pick<IInvolvedUser, 'id'>>(
    involvedUserCollection: Type[],
    ...involvedUsersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const involvedUsers: Type[] = involvedUsersToCheck.filter(isPresent);
    if (involvedUsers.length > 0) {
      const involvedUserCollectionIdentifiers = involvedUserCollection.map(
        involvedUserItem => this.getInvolvedUserIdentifier(involvedUserItem)!
      );
      const involvedUsersToAdd = involvedUsers.filter(involvedUserItem => {
        const involvedUserIdentifier = this.getInvolvedUserIdentifier(involvedUserItem);
        if (involvedUserCollectionIdentifiers.includes(involvedUserIdentifier)) {
          return false;
        }
        involvedUserCollectionIdentifiers.push(involvedUserIdentifier);
        return true;
      });
      return [...involvedUsersToAdd, ...involvedUserCollection];
    }
    return involvedUserCollection;
  }
}
