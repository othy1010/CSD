import { IMitigation, NewMitigation } from './mitigation.model';

export const sampleWithRequiredData: IMitigation = {
  id: 4517,
};

export const sampleWithPartialData: IMitigation = {
  id: 32047,
};

export const sampleWithFullData: IMitigation = {
  id: 91550,
};

export const sampleWithNewData: NewMitigation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
