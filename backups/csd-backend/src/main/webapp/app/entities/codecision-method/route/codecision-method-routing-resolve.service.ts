import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICodecisionMethod } from '../codecision-method.model';
import { CodecisionMethodService } from '../service/codecision-method.service';

@Injectable({ providedIn: 'root' })
export class CodecisionMethodRoutingResolveService implements Resolve<ICodecisionMethod | null> {
  constructor(protected service: CodecisionMethodService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICodecisionMethod | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((codecisionMethod: HttpResponse<ICodecisionMethod>) => {
          if (codecisionMethod.body) {
            return of(codecisionMethod.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
