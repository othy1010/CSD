import { ProcessKind } from 'app/entities/enumerations/process-kind.model';
import { EvaluationKind } from 'app/entities/enumerations/evaluation-kind.model';
import { AgreementThreshold } from 'app/entities/enumerations/agreement-threshold.model';

export interface ICodecisionMethod {
  id: number;
  processKind?: ProcessKind | null;
  evaluationKind?: EvaluationKind | null;
  agreementThreshold?: AgreementThreshold | null;
}

export type NewCodecisionMethod = Omit<ICodecisionMethod, 'id'> & { id: null };
