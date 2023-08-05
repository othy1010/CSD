import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IKnowuse, NewKnowuse } from '../knowuse.model';

export type PartialUpdateKnowuse = Partial<IKnowuse> & Pick<IKnowuse, 'id'>;

export type EntityResponseType = HttpResponse<IKnowuse>;
export type EntityArrayResponseType = HttpResponse<IKnowuse[]>;

@Injectable({ providedIn: 'root' })
export class KnowuseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/knowuses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(knowuse: NewKnowuse): Observable<EntityResponseType> {
    return this.http.post<IKnowuse>(this.resourceUrl, knowuse, { observe: 'response' });
  }

  update(knowuse: IKnowuse): Observable<EntityResponseType> {
    return this.http.put<IKnowuse>(`${this.resourceUrl}/${this.getKnowuseIdentifier(knowuse)}`, knowuse, { observe: 'response' });
  }

  partialUpdate(knowuse: PartialUpdateKnowuse): Observable<EntityResponseType> {
    return this.http.patch<IKnowuse>(`${this.resourceUrl}/${this.getKnowuseIdentifier(knowuse)}`, knowuse, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IKnowuse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IKnowuse[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getKnowuseIdentifier(knowuse: Pick<IKnowuse, 'id'>): number {
    return knowuse.id;
  }

  compareKnowuse(o1: Pick<IKnowuse, 'id'> | null, o2: Pick<IKnowuse, 'id'> | null): boolean {
    return o1 && o2 ? this.getKnowuseIdentifier(o1) === this.getKnowuseIdentifier(o2) : o1 === o2;
  }

  addKnowuseToCollectionIfMissing<Type extends Pick<IKnowuse, 'id'>>(
    knowuseCollection: Type[],
    ...knowusesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const knowuses: Type[] = knowusesToCheck.filter(isPresent);
    if (knowuses.length > 0) {
      const knowuseCollectionIdentifiers = knowuseCollection.map(knowuseItem => this.getKnowuseIdentifier(knowuseItem)!);
      const knowusesToAdd = knowuses.filter(knowuseItem => {
        const knowuseIdentifier = this.getKnowuseIdentifier(knowuseItem);
        if (knowuseCollectionIdentifiers.includes(knowuseIdentifier)) {
          return false;
        }
        knowuseCollectionIdentifiers.push(knowuseIdentifier);
        return true;
      });
      return [...knowusesToAdd, ...knowuseCollection];
    }
    return knowuseCollection;
  }
}
