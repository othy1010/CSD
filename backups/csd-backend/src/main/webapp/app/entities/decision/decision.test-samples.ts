import { AgreementType } from 'app/entities/enumerations/agreement-type.model';

import { IDecision, NewDecision } from './decision.model';

export const sampleWithRequiredData: IDecision = {
  id: 8383,
};

export const sampleWithPartialData: IDecision = {
  id: 92963,
  comment: 'Gold redundant up',
};

export const sampleWithFullData: IDecision = {
  id: 88321,
  agreement: AgreementType['TOBEREVISED'],
  comment: 'Florida synthesizing',
};

export const sampleWithNewData: NewDecision = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
