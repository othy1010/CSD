import { ProcessKind } from 'app/entities/enumerations/process-kind.model';
import { EvaluationKind } from 'app/entities/enumerations/evaluation-kind.model';
import { AgreementThreshold } from 'app/entities/enumerations/agreement-threshold.model';

import { ICodecisionMethod, NewCodecisionMethod } from './codecision-method.model';

export const sampleWithRequiredData: ICodecisionMethod = {
  id: 49591,
};

export const sampleWithPartialData: ICodecisionMethod = {
  id: 71155,
  processKind: ProcessKind['MAJORITY'],
  agreementThreshold: AgreementThreshold['CUSTOM'],
};

export const sampleWithFullData: ICodecisionMethod = {
  id: 81702,
  processKind: ProcessKind['CONSENSUS'],
  evaluationKind: EvaluationKind['YESNO'],
  agreementThreshold: AgreementThreshold['HIGH'],
};

export const sampleWithNewData: NewCodecisionMethod = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
