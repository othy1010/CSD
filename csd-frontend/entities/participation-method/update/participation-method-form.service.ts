import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IParticipationMethod, NewParticipationMethod } from '../participation-method.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IParticipationMethod for edit and NewParticipationMethodFormGroupInput for create.
 */
type ParticipationMethodFormGroupInput = IParticipationMethod | PartialWithRequiredKeyOf<NewParticipationMethod>;

type ParticipationMethodFormDefaults = Pick<NewParticipationMethod, 'id'>;

type ParticipationMethodFormGroupContent = {
  id: FormControl<IParticipationMethod['id'] | NewParticipationMethod['id']>;
  type: FormControl<IParticipationMethod['type']>;
};

export type ParticipationMethodFormGroup = FormGroup<ParticipationMethodFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ParticipationMethodFormService {
  createParticipationMethodFormGroup(participationMethod: ParticipationMethodFormGroupInput = { id: null }): ParticipationMethodFormGroup {
    const participationMethodRawValue = {
      ...this.getFormDefaults(),
      ...participationMethod,
    };
    return new FormGroup<ParticipationMethodFormGroupContent>({
      id: new FormControl(
        { value: participationMethodRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      type: new FormControl(participationMethodRawValue.type),
    });
  }

  getParticipationMethod(form: ParticipationMethodFormGroup): IParticipationMethod | NewParticipationMethod {
    return form.getRawValue() as IParticipationMethod | NewParticipationMethod;
  }

  resetForm(form: ParticipationMethodFormGroup, participationMethod: ParticipationMethodFormGroupInput): void {
    const participationMethodRawValue = { ...this.getFormDefaults(), ...participationMethod };
    form.reset(
      {
        ...participationMethodRawValue,
        id: { value: participationMethodRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ParticipationMethodFormDefaults {
    return {
      id: null,
    };
  }
}
