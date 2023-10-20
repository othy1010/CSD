import { ProcessKind } from '../enumerations/process-kind.model';
import { EvaluationKind } from '../enumerations/evaluation-kind.model';
import { AgreementThreshold } from '../enumerations/agreement-threshold.model';

export interface ICodecisionMethod {
  id: number;
  processKind?: ProcessKind | null;
  evaluationKind?: EvaluationKind | null;
  agreementThreshold?: AgreementThreshold | null;
}

export type NewCodecisionMethod = Omit<ICodecisionMethod, 'id'> & { id: null };
