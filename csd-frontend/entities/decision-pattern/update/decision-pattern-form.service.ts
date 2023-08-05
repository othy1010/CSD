import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDecisionPattern, NewDecisionPattern } from '../decision-pattern.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDecisionPattern for edit and NewDecisionPatternFormGroupInput for create.
 */
type DecisionPatternFormGroupInput = IDecisionPattern | PartialWithRequiredKeyOf<NewDecisionPattern>;

type DecisionPatternFormDefaults = Pick<NewDecisionPattern, 'id'>;

type DecisionPatternFormGroupContent = {
  id: FormControl<IDecisionPattern['id'] | NewDecisionPattern['id']>;
  name: FormControl<IDecisionPattern['name']>;
  description: FormControl<IDecisionPattern['description']>;
  participationMethod: FormControl<IDecisionPattern['participationMethod']>;
  codecisionMethod: FormControl<IDecisionPattern['codecisionMethod']>;
  intent: FormControl<IDecisionPattern['intent']>;
  solution: FormControl<IDecisionPattern['solution']>;
  application: FormControl<IDecisionPattern['application']>;
  knowuse: FormControl<IDecisionPattern['knowuse']>;
};

export type DecisionPatternFormGroup = FormGroup<DecisionPatternFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DecisionPatternFormService {
  createDecisionPatternFormGroup(decisionPattern: DecisionPatternFormGroupInput = { id: null }): DecisionPatternFormGroup {
    const decisionPatternRawValue = {
      ...this.getFormDefaults(),
      ...decisionPattern,
    };
    return new FormGroup<DecisionPatternFormGroupContent>({
      id: new FormControl(
        { value: decisionPatternRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(decisionPatternRawValue.name),
      description: new FormControl(decisionPatternRawValue.description),
      participationMethod: new FormControl(decisionPatternRawValue.participationMethod, {
        validators: [Validators.required],
      }),
      codecisionMethod: new FormControl(decisionPatternRawValue.codecisionMethod, {
        validators: [Validators.required],
      }),
      intent: new FormControl(decisionPatternRawValue.intent),
      solution: new FormControl(decisionPatternRawValue.solution),
      application: new FormControl(decisionPatternRawValue.application),
      knowuse: new FormControl(decisionPatternRawValue.knowuse),
    });
  }

  getDecisionPattern(form: DecisionPatternFormGroup): IDecisionPattern | NewDecisionPattern {
    return form.getRawValue() as IDecisionPattern | NewDecisionPattern;
  }

  resetForm(form: DecisionPatternFormGroup, decisionPattern: DecisionPatternFormGroupInput): void {
    const decisionPatternRawValue = { ...this.getFormDefaults(), ...decisionPattern };
    form.reset(
      {
        ...decisionPatternRawValue,
        id: { value: decisionPatternRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DecisionPatternFormDefaults {
    return {
      id: null,
    };
  }
}
