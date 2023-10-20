import { IProposal } from '../proposal/proposal.model';
import { ChangeType } from '../enumerations/change-type.model';

export interface IChange {
  id: number;
  type?: ChangeType | null;
  refId?: string | null;
  proposal?: Pick<IProposal, 'id'> | null;
}

export type NewChange = Omit<IChange, 'id'> & { id: null };
