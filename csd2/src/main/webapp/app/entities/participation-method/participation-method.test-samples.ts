import { ParticipationType } from 'app/entities/enumerations/participation-type.model';

import { IParticipationMethod, NewParticipationMethod } from './participation-method.model';

export const sampleWithRequiredData: IParticipationMethod = {
  id: 42627,
};

export const sampleWithPartialData: IParticipationMethod = {
  id: 91937,
  type: ParticipationType['DEMOCRATIC'],
};

export const sampleWithFullData: IParticipationMethod = {
  id: 15648,
  type: ParticipationType['RESTRICTED'],
};

export const sampleWithNewData: NewParticipationMethod = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
