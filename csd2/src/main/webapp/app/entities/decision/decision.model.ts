import { IProposal } from 'app/entities/proposal/proposal.model';
import { IInvolvedUser } from 'app/entities/involved-user/involved-user.model';
import { AgreementType } from 'app/entities/enumerations/agreement-type.model';

export interface IDecision {
  id: number;
  agreement?: AgreementType | null;
  comment?: string | null;
  proposal?: Pick<IProposal, 'id'> | null;
  user?: Pick<IInvolvedUser, 'id'> | null;
}

export type NewDecision = Omit<IDecision, 'id'> & { id: null };
