import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRisk, NewRisk } from '../risk.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRisk for edit and NewRiskFormGroupInput for create.
 */
type RiskFormGroupInput = IRisk | PartialWithRequiredKeyOf<NewRisk>;

type RiskFormDefaults = Pick<NewRisk, 'id' | 'proposals' | 'vulnerabilities'>;

type RiskFormGroupContent = {
  id: FormControl<IRisk['id'] | NewRisk['id']>;
  name: FormControl<IRisk['name']>;
  description: FormControl<IRisk['description']>;
  probability: FormControl<IRisk['probability']>;
  impactSeverity: FormControl<IRisk['impactSeverity']>;
  proposals: FormControl<IRisk['proposals']>;
  vulnerabilities: FormControl<IRisk['vulnerabilities']>;
};

export type RiskFormGroup = FormGroup<RiskFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RiskFormService {
  createRiskFormGroup(risk: RiskFormGroupInput = { id: null }): RiskFormGroup {
    const riskRawValue = {
      ...this.getFormDefaults(),
      ...risk,
    };
    return new FormGroup<RiskFormGroupContent>({
      id: new FormControl(
        { value: riskRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(riskRawValue.name),
      description: new FormControl(riskRawValue.description),
      probability: new FormControl(riskRawValue.probability),
      impactSeverity: new FormControl(riskRawValue.impactSeverity),
      proposals: new FormControl(riskRawValue.proposals ?? []),
      vulnerabilities: new FormControl(riskRawValue.vulnerabilities ?? []),
    });
  }

  getRisk(form: RiskFormGroup): IRisk | NewRisk {
    return form.getRawValue() as IRisk | NewRisk;
  }

  resetForm(form: RiskFormGroup, risk: RiskFormGroupInput): void {
    const riskRawValue = { ...this.getFormDefaults(), ...risk };
    form.reset(
      {
        ...riskRawValue,
        id: { value: riskRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RiskFormDefaults {
    return {
      id: null,
      proposals: [],
      vulnerabilities: [],
    };
  }
}
