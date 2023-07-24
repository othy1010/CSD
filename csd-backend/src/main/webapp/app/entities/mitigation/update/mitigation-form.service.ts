import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMitigation, NewMitigation } from '../mitigation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMitigation for edit and NewMitigationFormGroupInput for create.
 */
type MitigationFormGroupInput = IMitigation | PartialWithRequiredKeyOf<NewMitigation>;

type MitigationFormDefaults = Pick<NewMitigation, 'id' | 'vulnerabilities'>;

type MitigationFormGroupContent = {
  id: FormControl<IMitigation['id'] | NewMitigation['id']>;
  vulnerabilities: FormControl<IMitigation['vulnerabilities']>;
};

export type MitigationFormGroup = FormGroup<MitigationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MitigationFormService {
  createMitigationFormGroup(mitigation: MitigationFormGroupInput = { id: null }): MitigationFormGroup {
    const mitigationRawValue = {
      ...this.getFormDefaults(),
      ...mitigation,
    };
    return new FormGroup<MitigationFormGroupContent>({
      id: new FormControl(
        { value: mitigationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      vulnerabilities: new FormControl(mitigationRawValue.vulnerabilities ?? []),
    });
  }

  getMitigation(form: MitigationFormGroup): IMitigation | NewMitigation {
    return form.getRawValue() as IMitigation | NewMitigation;
  }

  resetForm(form: MitigationFormGroup, mitigation: MitigationFormGroupInput): void {
    const mitigationRawValue = { ...this.getFormDefaults(), ...mitigation };
    form.reset(
      {
        ...mitigationRawValue,
        id: { value: mitigationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MitigationFormDefaults {
    return {
      id: null,
      vulnerabilities: [],
    };
  }
}
