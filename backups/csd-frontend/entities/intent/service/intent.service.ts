import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIntent, NewIntent } from '../intent.model';

export type PartialUpdateIntent = Partial<IIntent> & Pick<IIntent, 'id'>;

export type EntityResponseType = HttpResponse<IIntent>;
export type EntityArrayResponseType = HttpResponse<IIntent[]>;

@Injectable({ providedIn: 'root' })
export class IntentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/intents');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(intent: NewIntent): Observable<EntityResponseType> {
    return this.http.post<IIntent>(this.resourceUrl, intent, { observe: 'response' });
  }

  update(intent: IIntent): Observable<EntityResponseType> {
    return this.http.put<IIntent>(`${this.resourceUrl}/${this.getIntentIdentifier(intent)}`, intent, { observe: 'response' });
  }

  partialUpdate(intent: PartialUpdateIntent): Observable<EntityResponseType> {
    return this.http.patch<IIntent>(`${this.resourceUrl}/${this.getIntentIdentifier(intent)}`, intent, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IIntent>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IIntent[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getIntentIdentifier(intent: Pick<IIntent, 'id'>): number {
    return intent.id;
  }

  compareIntent(o1: Pick<IIntent, 'id'> | null, o2: Pick<IIntent, 'id'> | null): boolean {
    return o1 && o2 ? this.getIntentIdentifier(o1) === this.getIntentIdentifier(o2) : o1 === o2;
  }

  addIntentToCollectionIfMissing<Type extends Pick<IIntent, 'id'>>(
    intentCollection: Type[],
    ...intentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const intents: Type[] = intentsToCheck.filter(isPresent);
    if (intents.length > 0) {
      const intentCollectionIdentifiers = intentCollection.map(intentItem => this.getIntentIdentifier(intentItem)!);
      const intentsToAdd = intents.filter(intentItem => {
        const intentIdentifier = this.getIntentIdentifier(intentItem);
        if (intentCollectionIdentifiers.includes(intentIdentifier)) {
          return false;
        }
        intentCollectionIdentifiers.push(intentIdentifier);
        return true;
      });
      return [...intentsToAdd, ...intentCollection];
    }
    return intentCollection;
  }
}
