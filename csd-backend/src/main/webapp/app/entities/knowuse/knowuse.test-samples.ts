import { IKnowuse, NewKnowuse } from './knowuse.model';

export const sampleWithRequiredData: IKnowuse = {
  id: 73935,
};

export const sampleWithPartialData: IKnowuse = {
  id: 20839,
};

export const sampleWithFullData: IKnowuse = {
  id: 73165,
  name: 'aggregate',
  description: 'Car Refined Money',
};

export const sampleWithNewData: NewKnowuse = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
