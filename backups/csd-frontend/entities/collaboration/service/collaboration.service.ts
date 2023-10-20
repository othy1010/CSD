import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICollaboration, NewCollaboration } from '../collaboration.model';

export type PartialUpdateCollaboration = Partial<ICollaboration> & Pick<ICollaboration, 'id'>;

type RestOf<T extends ICollaboration | NewCollaboration> = Omit<T, 'startDate'> & {
  startDate?: string | null;
};

export type RestCollaboration = RestOf<ICollaboration>;

export type NewRestCollaboration = RestOf<NewCollaboration>;

export type PartialUpdateRestCollaboration = RestOf<PartialUpdateCollaboration>;

export type EntityResponseType = HttpResponse<ICollaboration>;
export type EntityArrayResponseType = HttpResponse<ICollaboration[]>;

@Injectable({ providedIn: 'root' })
export class CollaborationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/collaborations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(collaboration: NewCollaboration): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(collaboration);
    return this.http
      .post<RestCollaboration>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(collaboration: ICollaboration): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(collaboration);
    return this.http
      .put<RestCollaboration>(`${this.resourceUrl}/${this.getCollaborationIdentifier(collaboration)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(collaboration: PartialUpdateCollaboration): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(collaboration);
    return this.http
      .patch<RestCollaboration>(`${this.resourceUrl}/${this.getCollaborationIdentifier(collaboration)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCollaboration>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCollaboration[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCollaborationIdentifier(collaboration: Pick<ICollaboration, 'id'>): number {
    return collaboration.id;
  }

  compareCollaboration(o1: Pick<ICollaboration, 'id'> | null, o2: Pick<ICollaboration, 'id'> | null): boolean {
    return o1 && o2 ? this.getCollaborationIdentifier(o1) === this.getCollaborationIdentifier(o2) : o1 === o2;
  }

  addCollaborationToCollectionIfMissing<Type extends Pick<ICollaboration, 'id'>>(
    collaborationCollection: Type[],
    ...collaborationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const collaborations: Type[] = collaborationsToCheck.filter(isPresent);
    if (collaborations.length > 0) {
      const collaborationCollectionIdentifiers = collaborationCollection.map(
        collaborationItem => this.getCollaborationIdentifier(collaborationItem)!
      );
      const collaborationsToAdd = collaborations.filter(collaborationItem => {
        const collaborationIdentifier = this.getCollaborationIdentifier(collaborationItem);
        if (collaborationCollectionIdentifiers.includes(collaborationIdentifier)) {
          return false;
        }
        collaborationCollectionIdentifiers.push(collaborationIdentifier);
        return true;
      });
      return [...collaborationsToAdd, ...collaborationCollection];
    }
    return collaborationCollection;
  }

  protected convertDateFromClient<T extends ICollaboration | NewCollaboration | PartialUpdateCollaboration>(collaboration: T): RestOf<T> {
    return {
      ...collaboration,
      startDate: collaboration.startDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restCollaboration: RestCollaboration): ICollaboration {
    return {
      ...restCollaboration,
      startDate: restCollaboration.startDate ? dayjs(restCollaboration.startDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCollaboration>): HttpResponse<ICollaboration> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCollaboration[]>): HttpResponse<ICollaboration[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
