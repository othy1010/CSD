import { IParticipationMethod } from 'app/entities/participation-method/participation-method.model';
import { ICodecisionMethod } from 'app/entities/codecision-method/codecision-method.model';
import { IIntent } from 'app/entities/intent/intent.model';
import { ISolution } from 'app/entities/solution/solution.model';
import { IApplication } from 'app/entities/application/application.model';
import { IKnowuse } from 'app/entities/knowuse/knowuse.model';

export interface IDecisionPattern {
  id: number;
  name?: string | null;
  description?: string | null;
  participationMethod?: Pick<IParticipationMethod, 'id'> | null;
  codecisionMethod?: Pick<ICodecisionMethod, 'id'> | null;
  intent?: Pick<IIntent, 'id'> | null;
  solution?: Pick<ISolution, 'id'> | null;
  application?: Pick<IApplication, 'id'> | null;
  knowuse?: Pick<IKnowuse, 'id'> | null;
}

export type NewDecisionPattern = Omit<IDecisionPattern, 'id'> & { id: null };
