import { IApplication, NewApplication } from './application.model';

export const sampleWithRequiredData: IApplication = {
  id: 99506,
};

export const sampleWithPartialData: IApplication = {
  id: 6690,
};

export const sampleWithFullData: IApplication = {
  id: 17599,
  name: 'compressing',
  description: 'Handmade invoice',
};

export const sampleWithNewData: NewApplication = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
