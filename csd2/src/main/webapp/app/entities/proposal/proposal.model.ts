import dayjs from 'dayjs/esm';
import { IInvolvedUser } from 'app/entities/involved-user/involved-user.model';
import { IRisk } from 'app/entities/risk/risk.model';
import { ICollaboration } from 'app/entities/collaboration/collaboration.model';
import { IVulnerability } from 'app/entities/vulnerability/vulnerability.model';
import { ProposalState } from 'app/entities/enumerations/proposal-state.model';

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
