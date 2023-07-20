import { IDecisionPattern, NewDecisionPattern } from './decision-pattern.model';

export const sampleWithRequiredData: IDecisionPattern = {
  id: 95112,
};

export const sampleWithPartialData: IDecisionPattern = {
  id: 79641,
};

export const sampleWithFullData: IDecisionPattern = {
  id: 95774,
  name: 'JSON',
  description: 'monitoring exuding',
};

export const sampleWithNewData: NewDecisionPattern = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
