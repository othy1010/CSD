import { IVulnerability } from 'app/entities/vulnerability/vulnerability.model';
import { ThreatReference } from 'app/entities/enumerations/threat-reference.model';

export interface IThreat {
  id: number;
  name?: string | null;
  description?: string | null;
  probability?: number | null;
  reference?: ThreatReference | null;
  refId?: string | null;
  vulnerabilities?: Pick<IVulnerability, 'id'>[] | null;
}

export type NewThreat = Omit<IThreat, 'id'> & { id: null };
