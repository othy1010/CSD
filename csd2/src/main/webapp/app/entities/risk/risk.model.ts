import { IProposal } from 'app/entities/proposal/proposal.model';
import { IVulnerability } from 'app/entities/vulnerability/vulnerability.model';
import { Severity } from 'app/entities/enumerations/severity.model';

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
