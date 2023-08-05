import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IThreat, NewThreat } from '../threat.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IThreat for edit and NewThreatFormGroupInput for create.
 */
type ThreatFormGroupInput = IThreat | PartialWithRequiredKeyOf<NewThreat>;

type ThreatFormDefaults = Pick<NewThreat, 'id' | 'vulnerabilities'>;

type ThreatFormGroupContent = {
  id: FormControl<IThreat['id'] | NewThreat['id']>;
  name: FormControl<IThreat['name']>;
  description: FormControl<IThreat['description']>;
  probability: FormControl<IThreat['probability']>;
  reference: FormControl<IThreat['reference']>;
  refId: FormControl<IThreat['refId']>;
  vulnerabilities: FormControl<IThreat['vulnerabilities']>;
};

export type ThreatFormGroup = FormGroup<ThreatFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ThreatFormService {
  createThreatFormGroup(threat: ThreatFormGroupInput = { id: null }): ThreatFormGroup {
    const threatRawValue = {
      ...this.getFormDefaults(),
      ...threat,
    };
    return new FormGroup<ThreatFormGroupContent>({
      id: new FormControl(
        { value: threatRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(threatRawValue.name),
      description: new FormControl(threatRawValue.description),
      probability: new FormControl(threatRawValue.probability),
      reference: new FormControl(threatRawValue.reference),
      refId: new FormControl(threatRawValue.refId),
      vulnerabilities: new FormControl(threatRawValue.vulnerabilities ?? []),
    });
  }

  getThreat(form: ThreatFormGroup): IThreat | NewThreat {
    return form.getRawValue() as IThreat | NewThreat;
  }

  resetForm(form: ThreatFormGroup, threat: ThreatFormGroupInput): void {
    const threatRawValue = { ...this.getFormDefaults(), ...threat };
    form.reset(
      {
        ...threatRawValue,
        id: { value: threatRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ThreatFormDefaults {
    return {
      id: null,
      vulnerabilities: [],
    };
  }
}
