import { SelectionCriteriaType } from 'app/entities/enumerations/selection-criteria-type.model';

import { ISelectionCriteria, NewSelectionCriteria } from './selection-criteria.model';

export const sampleWithRequiredData: ISelectionCriteria = {
  id: 66740,
};

export const sampleWithPartialData: ISelectionCriteria = {
  id: 58767,
  criterion: SelectionCriteriaType['EXPERTISELEVEL'],
};

export const sampleWithFullData: ISelectionCriteria = {
  id: 19393,
  criterion: SelectionCriteriaType['INVOLVEMENT'],
};

export const sampleWithNewData: NewSelectionCriteria = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
