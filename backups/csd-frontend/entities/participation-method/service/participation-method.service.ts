import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParticipationMethod, NewParticipationMethod } from '../participation-method.model';

export type PartialUpdateParticipationMethod = Partial<IParticipationMethod> & Pick<IParticipationMethod, 'id'>;

export type EntityResponseType = HttpResponse<IParticipationMethod>;
export type EntityArrayResponseType = HttpResponse<IParticipationMethod[]>;

@Injectable({ providedIn: 'root' })
export class ParticipationMethodService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/participation-methods');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(participationMethod: NewParticipationMethod): Observable<EntityResponseType> {
    return this.http.post<IParticipationMethod>(this.resourceUrl, participationMethod, { observe: 'response' });
  }

  update(participationMethod: IParticipationMethod): Observable<EntityResponseType> {
    return this.http.put<IParticipationMethod>(
      `${this.resourceUrl}/${this.getParticipationMethodIdentifier(participationMethod)}`,
      participationMethod,
      { observe: 'response' }
    );
  }

  partialUpdate(participationMethod: PartialUpdateParticipationMethod): Observable<EntityResponseType> {
    return this.http.patch<IParticipationMethod>(
      `${this.resourceUrl}/${this.getParticipationMethodIdentifier(participationMethod)}`,
      participationMethod,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IParticipationMethod>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IParticipationMethod[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getParticipationMethodIdentifier(participationMethod: Pick<IParticipationMethod, 'id'>): number {
    return participationMethod.id;
  }

  compareParticipationMethod(o1: Pick<IParticipationMethod, 'id'> | null, o2: Pick<IParticipationMethod, 'id'> | null): boolean {
    return o1 && o2 ? this.getParticipationMethodIdentifier(o1) === this.getParticipationMethodIdentifier(o2) : o1 === o2;
  }

  addParticipationMethodToCollectionIfMissing<Type extends Pick<IParticipationMethod, 'id'>>(
    participationMethodCollection: Type[],
    ...participationMethodsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const participationMethods: Type[] = participationMethodsToCheck.filter(isPresent);
    if (participationMethods.length > 0) {
      const participationMethodCollectionIdentifiers = participationMethodCollection.map(
        participationMethodItem => this.getParticipationMethodIdentifier(participationMethodItem)!
      );
      const participationMethodsToAdd = participationMethods.filter(participationMethodItem => {
        const participationMethodIdentifier = this.getParticipationMethodIdentifier(participationMethodItem);
        if (participationMethodCollectionIdentifiers.includes(participationMethodIdentifier)) {
          return false;
        }
        participationMethodCollectionIdentifiers.push(participationMethodIdentifier);
        return true;
      });
      return [...participationMethodsToAdd, ...participationMethodCollection];
    }
    return participationMethodCollection;
  }
}
