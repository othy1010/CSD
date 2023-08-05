import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISelectionCriteria, NewSelectionCriteria } from '../selection-criteria.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISelectionCriteria for edit and NewSelectionCriteriaFormGroupInput for create.
 */
type SelectionCriteriaFormGroupInput = ISelectionCriteria | PartialWithRequiredKeyOf<NewSelectionCriteria>;

type SelectionCriteriaFormDefaults = Pick<NewSelectionCriteria, 'id'>;

type SelectionCriteriaFormGroupContent = {
  id: FormControl<ISelectionCriteria['id'] | NewSelectionCriteria['id']>;
  criterion: FormControl<ISelectionCriteria['criterion']>;
  participationMethod: FormControl<ISelectionCriteria['participationMethod']>;
};

export type SelectionCriteriaFormGroup = FormGroup<SelectionCriteriaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SelectionCriteriaFormService {
  createSelectionCriteriaFormGroup(selectionCriteria: SelectionCriteriaFormGroupInput = { id: null }): SelectionCriteriaFormGroup {
    const selectionCriteriaRawValue = {
      ...this.getFormDefaults(),
      ...selectionCriteria,
    };
    return new FormGroup<SelectionCriteriaFormGroupContent>({
      id: new FormControl(
        { value: selectionCriteriaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      criterion: new FormControl(selectionCriteriaRawValue.criterion),
      participationMethod: new FormControl(selectionCriteriaRawValue.participationMethod),
    });
  }

  getSelectionCriteria(form: SelectionCriteriaFormGroup): ISelectionCriteria | NewSelectionCriteria {
    return form.getRawValue() as ISelectionCriteria | NewSelectionCriteria;
  }

  resetForm(form: SelectionCriteriaFormGroup, selectionCriteria: SelectionCriteriaFormGroupInput): void {
    const selectionCriteriaRawValue = { ...this.getFormDefaults(), ...selectionCriteria };
    form.reset(
      {
        ...selectionCriteriaRawValue,
        id: { value: selectionCriteriaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SelectionCriteriaFormDefaults {
    return {
      id: null,
    };
  }
}
