import { ParameterKind } from 'app/entities/enumerations/parameter-kind.model';

import { IParameter, NewParameter } from './parameter.model';

export const sampleWithRequiredData: IParameter = {
  id: 1739,
};

export const sampleWithPartialData: IParameter = {
  id: 50525,
};

export const sampleWithFullData: IParameter = {
  id: 38187,
  kind: ParameterKind['ANONYMOUS'],
};

export const sampleWithNewData: NewParameter = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
