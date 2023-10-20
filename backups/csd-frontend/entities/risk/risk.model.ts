import { IProposal } from '../proposal/proposal.model';
import { IVulnerability } from '../vulnerability/vulnerability.model';
import { Severity } from '../enumerations/severity.model';

export interface IRisk {
  id: number;
  name?: string | null;
  description?: string | null;
  probability?: number | null;
  impactSeverity?: Severity | null;
  proposals?: Pick<IProposal, 'id'>[] | null;
  vulnerabilities?: Pick<IVulnerability, 'id'>[] | null;
}

export type NewRisk = Omit<IRisk, 'id'> & { id: null };
