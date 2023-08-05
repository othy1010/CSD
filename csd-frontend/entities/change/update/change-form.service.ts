import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IChange, NewChange } from '../change.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IChange for edit and NewChangeFormGroupInput for create.
 */
type ChangeFormGroupInput = IChange | PartialWithRequiredKeyOf<NewChange>;

type ChangeFormDefaults = Pick<NewChange, 'id'>;

type ChangeFormGroupContent = {
  id: FormControl<IChange['id'] | NewChange['id']>;
  type: FormControl<IChange['type']>;
  refId: FormControl<IChange['refId']>;
  proposal: FormControl<IChange['proposal']>;
};

export type ChangeFormGroup = FormGroup<ChangeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ChangeFormService {
  createChangeFormGroup(change: ChangeFormGroupInput = { id: null }): ChangeFormGroup {
    const changeRawValue = {
      ...this.getFormDefaults(),
      ...change,
    };
    return new FormGroup<ChangeFormGroupContent>({
      id: new FormControl(
        { value: changeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      type: new FormControl(changeRawValue.type),
      refId: new FormControl(changeRawValue.refId),
      proposal: new FormControl(changeRawValue.proposal),
    });
  }

  getChange(form: ChangeFormGroup): IChange | NewChange {
    return form.getRawValue() as IChange | NewChange;
  }

  resetForm(form: ChangeFormGroup, change: ChangeFormGroupInput): void {
    const changeRawValue = { ...this.getFormDefaults(), ...change };
    form.reset(
      {
        ...changeRawValue,
        id: { value: changeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ChangeFormDefaults {
    return {
      id: null,
    };
  }
}
