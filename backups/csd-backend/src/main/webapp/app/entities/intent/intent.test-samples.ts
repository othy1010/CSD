import { IIntent, NewIntent } from './intent.model';

export const sampleWithRequiredData: IIntent = {
  id: 80050,
};

export const sampleWithPartialData: IIntent = {
  id: 68141,
  name: 'Michigan Switchable Hat',
  description: 'Director THX withdrawal',
};

export const sampleWithFullData: IIntent = {
  id: 16886,
  name: 'copy',
  description: 'monetize Operations',
};

export const sampleWithNewData: NewIntent = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
