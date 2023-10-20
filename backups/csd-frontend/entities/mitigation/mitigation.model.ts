import { IVulnerability } from '../vulnerability/vulnerability.model';

export interface IMitigation {
  id: number;
  vulnerabilities?: Pick<IVulnerability, 'id'>[] | null;
}

export type NewMitigation = Omit<IMitigation, 'id'> & { id: null };
