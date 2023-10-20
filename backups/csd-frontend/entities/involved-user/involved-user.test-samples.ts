import { UserRole } from 'app/entities/enumerations/user-role.model';

import { IInvolvedUser, NewInvolvedUser } from './involved-user.model';

export const sampleWithRequiredData: IInvolvedUser = {
  id: 59999,
};

export const sampleWithPartialData: IInvolvedUser = {
  id: 97388,
  userRole: UserRole['DEVELOPER'],
  isEligibleDM: false,
};

export const sampleWithFullData: IInvolvedUser = {
  id: 6638,
  expertiseLevel: 65616,
  userRole: UserRole['SECURITYEXPERT'],
  isModerator: false,
  isEligibleDM: true,
};

export const sampleWithNewData: NewInvolvedUser = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
