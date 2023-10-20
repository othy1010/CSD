import { ThreatReference } from 'app/entities/enumerations/threat-reference.model';

import { IThreat, NewThreat } from './threat.model';

export const sampleWithRequiredData: IThreat = {
  id: 59748,
};

export const sampleWithPartialData: IThreat = {
  id: 16292,
  name: 'empower',
  description: 'Operations Soft grow',
  probability: 70303,
  reference: ThreatReference['ATTACK'],
  refId: 'Spurs Hat',
};

export const sampleWithFullData: IThreat = {
  id: 43882,
  name: 'Human orchid Ball',
  description: 'Texas Team-oriented',
  probability: 29666,
  reference: ThreatReference['CAPEC'],
  refId: 'JBOD application',
};

export const sampleWithNewData: NewThreat = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
