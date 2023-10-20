import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IKnowuse, NewKnowuse } from '../knowuse.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IKnowuse for edit and NewKnowuseFormGroupInput for create.
 */
type KnowuseFormGroupInput = IKnowuse | PartialWithRequiredKeyOf<NewKnowuse>;

type KnowuseFormDefaults = Pick<NewKnowuse, 'id'>;

type KnowuseFormGroupContent = {
  id: FormControl<IKnowuse['id'] | NewKnowuse['id']>;
  name: FormControl<IKnowuse['name']>;
  description: FormControl<IKnowuse['description']>;
};

export type KnowuseFormGroup = FormGroup<KnowuseFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class KnowuseFormService {
  createKnowuseFormGroup(knowuse: KnowuseFormGroupInput = { id: null }): KnowuseFormGroup {
    const knowuseRawValue = {
      ...this.getFormDefaults(),
      ...knowuse,
    };
    return new FormGroup<KnowuseFormGroupContent>({
      id: new FormControl(
        { value: knowuseRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(knowuseRawValue.name),
      description: new FormControl(knowuseRawValue.description),
    });
  }

  getKnowuse(form: KnowuseFormGroup): IKnowuse | NewKnowuse {
    return form.getRawValue() as IKnowuse | NewKnowuse;
  }

  resetForm(form: KnowuseFormGroup, knowuse: KnowuseFormGroupInput): void {
    const knowuseRawValue = { ...this.getFormDefaults(), ...knowuse };
    form.reset(
      {
        ...knowuseRawValue,
        id: { value: knowuseRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): KnowuseFormDefaults {
    return {
      id: null,
    };
  }
}
