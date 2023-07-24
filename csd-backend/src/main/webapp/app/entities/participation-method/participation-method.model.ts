import { ParticipationType } from 'app/entities/enumerations/participation-type.model';

export interface IParticipationMethod {
  id: number;
  type?: ParticipationType | null;
}

export type NewParticipationMethod = Omit<IParticipationMethod, 'id'> & { id: null };
