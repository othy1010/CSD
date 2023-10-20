import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICodecisionMethod, NewCodecisionMethod } from '../codecision-method.model';

export type PartialUpdateCodecisionMethod = Partial<ICodecisionMethod> & Pick<ICodecisionMethod, 'id'>;

export type EntityResponseType = HttpResponse<ICodecisionMethod>;
export type EntityArrayResponseType = HttpResponse<ICodecisionMethod[]>;

@Injectable({ providedIn: 'root' })
export class CodecisionMethodService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/codecision-methods');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(codecisionMethod: NewCodecisionMethod): Observable<EntityResponseType> {
    return this.http.post<ICodecisionMethod>(this.resourceUrl, codecisionMethod, { observe: 'response' });
  }

  update(codecisionMethod: ICodecisionMethod): Observable<EntityResponseType> {
    return this.http.put<ICodecisionMethod>(
      `${this.resourceUrl}/${this.getCodecisionMethodIdentifier(codecisionMethod)}`,
      codecisionMethod,
      { observe: 'response' }
    );
  }

  partialUpdate(codecisionMethod: PartialUpdateCodecisionMethod): Observable<EntityResponseType> {
    return this.http.patch<ICodecisionMethod>(
      `${this.resourceUrl}/${this.getCodecisionMethodIdentifier(codecisionMethod)}`,
      codecisionMethod,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICodecisionMethod>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICodecisionMethod[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCodecisionMethodIdentifier(codecisionMethod: Pick<ICodecisionMethod, 'id'>): number {
    return codecisionMethod.id;
  }

  compareCodecisionMethod(o1: Pick<ICodecisionMethod, 'id'> | null, o2: Pick<ICodecisionMethod, 'id'> | null): boolean {
    return o1 && o2 ? this.getCodecisionMethodIdentifier(o1) === this.getCodecisionMethodIdentifier(o2) : o1 === o2;
  }

  addCodecisionMethodToCollectionIfMissing<Type extends Pick<ICodecisionMethod, 'id'>>(
    codecisionMethodCollection: Type[],
    ...codecisionMethodsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const codecisionMethods: Type[] = codecisionMethodsToCheck.filter(isPresent);
    if (codecisionMethods.length > 0) {
      const codecisionMethodCollectionIdentifiers = codecisionMethodCollection.map(
        codecisionMethodItem => this.getCodecisionMethodIdentifier(codecisionMethodItem)!
      );
      const codecisionMethodsToAdd = codecisionMethods.filter(codecisionMethodItem => {
        const codecisionMethodIdentifier = this.getCodecisionMethodIdentifier(codecisionMethodItem);
        if (codecisionMethodCollectionIdentifiers.includes(codecisionMethodIdentifier)) {
          return false;
        }
        codecisionMethodCollectionIdentifiers.push(codecisionMethodIdentifier);
        return true;
      });
      return [...codecisionMethodsToAdd, ...codecisionMethodCollection];
    }
    return codecisionMethodCollection;
  }
}
