import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMitigation, NewMitigation } from '../mitigation.model';

export type PartialUpdateMitigation = Partial<IMitigation> & Pick<IMitigation, 'id'>;

export type EntityResponseType = HttpResponse<IMitigation>;
export type EntityArrayResponseType = HttpResponse<IMitigation[]>;

@Injectable({ providedIn: 'root' })
export class MitigationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mitigations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mitigation: NewMitigation): Observable<EntityResponseType> {
    return this.http.post<IMitigation>(this.resourceUrl, mitigation, { observe: 'response' });
  }

  update(mitigation: IMitigation): Observable<EntityResponseType> {
    return this.http.put<IMitigation>(`${this.resourceUrl}/${this.getMitigationIdentifier(mitigation)}`, mitigation, {
      observe: 'response',
    });
  }

  partialUpdate(mitigation: PartialUpdateMitigation): Observable<EntityResponseType> {
    return this.http.patch<IMitigation>(`${this.resourceUrl}/${this.getMitigationIdentifier(mitigation)}`, mitigation, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMitigation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMitigation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMitigationIdentifier(mitigation: Pick<IMitigation, 'id'>): number {
    return mitigation.id;
  }

  compareMitigation(o1: Pick<IMitigation, 'id'> | null, o2: Pick<IMitigation, 'id'> | null): boolean {
    return o1 && o2 ? this.getMitigationIdentifier(o1) === this.getMitigationIdentifier(o2) : o1 === o2;
  }

  addMitigationToCollectionIfMissing<Type extends Pick<IMitigation, 'id'>>(
    mitigationCollection: Type[],
    ...mitigationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const mitigations: Type[] = mitigationsToCheck.filter(isPresent);
    if (mitigations.length > 0) {
      const mitigationCollectionIdentifiers = mitigationCollection.map(mitigationItem => this.getMitigationIdentifier(mitigationItem)!);
      const mitigationsToAdd = mitigations.filter(mitigationItem => {
        const mitigationIdentifier = this.getMitigationIdentifier(mitigationItem);
        if (mitigationCollectionIdentifiers.includes(mitigationIdentifier)) {
          return false;
        }
        mitigationCollectionIdentifiers.push(mitigationIdentifier);
        return true;
      });
      return [...mitigationsToAdd, ...mitigationCollection];
    }
    return mitigationCollection;
  }
}
