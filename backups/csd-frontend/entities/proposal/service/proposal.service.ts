import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProposal, NewProposal } from '../proposal.model';

export type PartialUpdateProposal = Partial<IProposal> & Pick<IProposal, 'id'>;

type RestOf<T extends IProposal | NewProposal> = Omit<T, 'creationDate'> & {
  creationDate?: string | null;
};

export type RestProposal = RestOf<IProposal>;

export type NewRestProposal = RestOf<NewProposal>;

export type PartialUpdateRestProposal = RestOf<PartialUpdateProposal>;

export type EntityResponseType = HttpResponse<IProposal>;
export type EntityArrayResponseType = HttpResponse<IProposal[]>;

@Injectable({ providedIn: 'root' })
export class ProposalService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/proposals');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(proposal: NewProposal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(proposal);
    return this.http
      .post<RestProposal>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(proposal: IProposal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(proposal);
    return this.http
      .put<RestProposal>(`${this.resourceUrl}/${this.getProposalIdentifier(proposal)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(proposal: PartialUpdateProposal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(proposal);
    return this.http
      .patch<RestProposal>(`${this.resourceUrl}/${this.getProposalIdentifier(proposal)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProposal>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProposal[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProposalIdentifier(proposal: Pick<IProposal, 'id'>): number {
    return proposal.id;
  }

  compareProposal(o1: Pick<IProposal, 'id'> | null, o2: Pick<IProposal, 'id'> | null): boolean {
    return o1 && o2 ? this.getProposalIdentifier(o1) === this.getProposalIdentifier(o2) : o1 === o2;
  }

  addProposalToCollectionIfMissing<Type extends Pick<IProposal, 'id'>>(
    proposalCollection: Type[],
    ...proposalsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const proposals: Type[] = proposalsToCheck.filter(isPresent);
    if (proposals.length > 0) {
      const proposalCollectionIdentifiers = proposalCollection.map(proposalItem => this.getProposalIdentifier(proposalItem)!);
      const proposalsToAdd = proposals.filter(proposalItem => {
        const proposalIdentifier = this.getProposalIdentifier(proposalItem);
        if (proposalCollectionIdentifiers.includes(proposalIdentifier)) {
          return false;
        }
        proposalCollectionIdentifiers.push(proposalIdentifier);
        return true;
      });
      return [...proposalsToAdd, ...proposalCollection];
    }
    return proposalCollection;
  }

  protected convertDateFromClient<T extends IProposal | NewProposal | PartialUpdateProposal>(proposal: T): RestOf<T> {
    return {
      ...proposal,
      creationDate: proposal.creationDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restProposal: RestProposal): IProposal {
    return {
      ...restProposal,
      creationDate: restProposal.creationDate ? dayjs(restProposal.creationDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProposal>): HttpResponse<IProposal> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProposal[]>): HttpResponse<IProposal[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
