import { ChangeType } from 'app/entities/enumerations/change-type.model';

import { IChange, NewChange } from './change.model';

export const sampleWithRequiredData: IChange = {
  id: 19218,
};

export const sampleWithPartialData: IChange = {
  id: 34102,
  type: ChangeType['MODIFIEDELT'],
};

export const sampleWithFullData: IChange = {
  id: 96890,
  type: ChangeType['ADDEDELT'],
  refId: 'programming Buckinghamshire',
};

export const sampleWithNewData: NewChange = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
