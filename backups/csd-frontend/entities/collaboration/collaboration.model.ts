import dayjs from 'dayjs/esm';
import { IDecisionPattern } from '../decision-pattern/decision-pattern.model';

import { CollaborationState } from '../enumerations/collaboration-state.model';

export interface ICollaboration {
  id: number;
  name?: string | null;
  description?: string | null;
  startDate?: dayjs.Dayjs | null;
  decisionDuration?: number | null;
  evaluationDuration?: number | null;
  collaborationState?: CollaborationState | null;
  decisionPattern?: Pick<IDecisionPattern, 'id'> | null;
}

export type NewCollaboration = Omit<ICollaboration, 'id'> & { id: null };
