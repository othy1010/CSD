import dayjs from 'dayjs/esm';

import { CollaborationState } from 'app/entities/enumerations/collaboration-state.model';

import { ICollaboration, NewCollaboration } from './collaboration.model';

export const sampleWithRequiredData: ICollaboration = {
  id: 43716,
};

export const sampleWithPartialData: ICollaboration = {
  id: 49119,
  startDate: dayjs('2023-06-13'),
  decisionDuration: 75113,
  evaluationDuration: 67222,
};

export const sampleWithFullData: ICollaboration = {
  id: 34071,
  name: 'B2C Maryland',
  description: 'Executive Oman',
  startDate: dayjs('2023-06-13'),
  decisionDuration: 8516,
  evaluationDuration: 14347,
  collaborationState: CollaborationState['SUSPENDED'],
};

export const sampleWithNewData: NewCollaboration = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
