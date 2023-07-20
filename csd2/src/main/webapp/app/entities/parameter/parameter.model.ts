import { IParticipationMethod } from 'app/entities/participation-method/participation-method.model';
import { ParameterKind } from 'app/entities/enumerations/parameter-kind.model';

export interface IParameter {
  id: number;
  kind?: ParameterKind | null;
  participationMethod?: Pick<IParticipationMethod, 'id'> | null;
}

export type NewParameter = Omit<IParameter, 'id'> & { id: null };
