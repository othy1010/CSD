import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IParameter, NewParameter } from '../parameter.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IParameter for edit and NewParameterFormGroupInput for create.
 */
type ParameterFormGroupInput = IParameter | PartialWithRequiredKeyOf<NewParameter>;

type ParameterFormDefaults = Pick<NewParameter, 'id'>;

type ParameterFormGroupContent = {
  id: FormControl<IParameter['id'] | NewParameter['id']>;
  kind: FormControl<IParameter['kind']>;
  participationMethod: FormControl<IParameter['participationMethod']>;
};

export type ParameterFormGroup = FormGroup<ParameterFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ParameterFormService {
  createParameterFormGroup(parameter: ParameterFormGroupInput = { id: null }): ParameterFormGroup {
    const parameterRawValue = {
      ...this.getFormDefaults(),
      ...parameter,
    };
    return new FormGroup<ParameterFormGroupContent>({
      id: new FormControl(
        { value: parameterRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      kind: new FormControl(parameterRawValue.kind),
      participationMethod: new FormControl(parameterRawValue.participationMethod),
    });
  }

  getParameter(form: ParameterFormGroup): IParameter | NewParameter {
    return form.getRawValue() as IParameter | NewParameter;
  }

  resetForm(form: ParameterFormGroup, parameter: ParameterFormGroupInput): void {
    const parameterRawValue = { ...this.getFormDefaults(), ...parameter };
    form.reset(
      {
        ...parameterRawValue,
        id: { value: parameterRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ParameterFormDefaults {
    return {
      id: null,
    };
  }
}
