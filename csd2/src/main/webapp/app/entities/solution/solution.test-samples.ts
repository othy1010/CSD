import { ISolution, NewSolution } from './solution.model';

export const sampleWithRequiredData: ISolution = {
  id: 48937,
};

export const sampleWithPartialData: ISolution = {
  id: 39835,
};

export const sampleWithFullData: ISolution = {
  id: 17567,
  name: 'Balanced logistical scale',
  description: 'SQL',
};

export const sampleWithNewData: NewSolution = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
