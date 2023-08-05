import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IThreat, NewThreat } from '../threat.model';

export type PartialUpdateThreat = Partial<IThreat> & Pick<IThreat, 'id'>;

export type EntityResponseType = HttpResponse<IThreat>;
export type EntityArrayResponseType = HttpResponse<IThreat[]>;

@Injectable({ providedIn: 'root' })
export class ThreatService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/threats');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(threat: NewThreat): Observable<EntityResponseType> {
    return this.http.post<IThreat>(this.resourceUrl, threat, { observe: 'response' });
  }

  update(threat: IThreat): Observable<EntityResponseType> {
    return this.http.put<IThreat>(`${this.resourceUrl}/${this.getThreatIdentifier(threat)}`, threat, { observe: 'response' });
  }

  partialUpdate(threat: PartialUpdateThreat): Observable<EntityResponseType> {
    return this.http.patch<IThreat>(`${this.resourceUrl}/${this.getThreatIdentifier(threat)}`, threat, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IThreat>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IThreat[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getThreatIdentifier(threat: Pick<IThreat, 'id'>): number {
    return threat.id;
  }

  compareThreat(o1: Pick<IThreat, 'id'> | null, o2: Pick<IThreat, 'id'> | null): boolean {
    return o1 && o2 ? this.getThreatIdentifier(o1) === this.getThreatIdentifier(o2) : o1 === o2;
  }

  addThreatToCollectionIfMissing<Type extends Pick<IThreat, 'id'>>(
    threatCollection: Type[],
    ...threatsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const threats: Type[] = threatsToCheck.filter(isPresent);
    if (threats.length > 0) {
      const threatCollectionIdentifiers = threatCollection.map(threatItem => this.getThreatIdentifier(threatItem)!);
      const threatsToAdd = threats.filter(threatItem => {
        const threatIdentifier = this.getThreatIdentifier(threatItem);
        if (threatCollectionIdentifiers.includes(threatIdentifier)) {
          return false;
        }
        threatCollectionIdentifiers.push(threatIdentifier);
        return true;
      });
      return [...threatsToAdd, ...threatCollection];
    }
    return threatCollection;
  }
}
