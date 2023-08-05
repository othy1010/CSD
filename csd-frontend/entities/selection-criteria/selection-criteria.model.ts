import { IParticipationMethod } from '../participation-method/participation-method.model';
import { SelectionCriteriaType } from '../enumerations/selection-criteria-type.model';

export interface ISelectionCriteria {
  id: number;
  criterion?: SelectionCriteriaType | null;
  participationMethod?: Pick<IParticipationMethod, 'id'> | null;
}

export type NewSelectionCriteria = Omit<ISelectionCriteria, 'id'> & { id: null };
