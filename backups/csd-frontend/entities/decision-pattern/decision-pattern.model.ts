import { IParticipationMethod } from '../participation-method/participation-method.model';
import { ICodecisionMethod } from '../codecision-method/codecision-method.model';
import { IIntent } from '../intent/intent.model';
import { ISolution } from '../solution/solution.model';
import { IApplication } from '../application/application.model';
import { IKnowuse } from '../knowuse/knowuse.model';

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
