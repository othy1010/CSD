import { Severity } from 'app/entities/enumerations/severity.model';

import { IRisk, NewRisk } from './risk.model';

export const sampleWithRequiredData: IRisk = {
  id: 12458,
};

export const sampleWithPartialData: IRisk = {
  id: 55905,
  name: 'neural Industrial Dollar',
  description: 'flexibility transmitting payment',
  probability: 51754,
  impactSeverity: Severity['MEDIUM'],
};

export const sampleWithFullData: IRisk = {
  id: 78916,
  name: 'Soft',
  description: 'Pennsylvania portals optical',
  probability: 58351,
  impactSeverity: Severity['LOW'],
};

export const sampleWithNewData: NewRisk = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
