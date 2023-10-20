import dayjs from 'dayjs/esm';
import { IInvolvedUser } from '../involved-user/involved-user.model';
import { IRisk } from '../risk/risk.model';
import { ICollaboration } from '../collaboration/collaboration.model';
import { IVulnerability } from '../vulnerability/vulnerability.model';
import { ProposalState } from '../enumerations/proposal-state.model';

export interface IProposal {
  id: number;
  name?: string | null;
  description?: string | null;
  creationDate?: dayjs.Dayjs | null;
  proposalState?: ProposalState | null;
  user?: Pick<IInvolvedUser, 'id'> | null;
  risks?: Pick<IRisk, 'id'>[] | null;
  collaboration?: Pick<ICollaboration, 'id'> | null;
  vulnerabilities?: Pick<IVulnerability, 'id'>[] | null;
}

export type NewProposal = Omit<IProposal, 'id'> & { id: null };
