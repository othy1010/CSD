import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDecision, NewDecision } from '../decision.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDecision for edit and NewDecisionFormGroupInput for create.
 */
type DecisionFormGroupInput = IDecision | PartialWithRequiredKeyOf<NewDecision>;

type DecisionFormDefaults = Pick<NewDecision, 'id'>;

type DecisionFormGroupContent = {
  id: FormControl<IDecision['id'] | NewDecision['id']>;
  agreement: FormControl<IDecision['agreement']>;
  comment: FormControl<IDecision['comment']>;
  proposal: FormControl<IDecision['proposal']>;
  user: FormControl<IDecision['user']>;
};

export type DecisionFormGroup = FormGroup<DecisionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DecisionFormService {
  createDecisionFormGroup(decision: DecisionFormGroupInput = { id: null }): DecisionFormGroup {
    const decisionRawValue = {
      ...this.getFormDefaults(),
      ...decision,
    };
    return new FormGroup<DecisionFormGroupContent>({
      id: new FormControl(
        { value: decisionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      agreement: new FormControl(decisionRawValue.agreement),
      comment: new FormControl(decisionRawValue.comment),
      proposal: new FormControl(decisionRawValue.proposal, {
        validators: [Validators.required],
      }),
      user: new FormControl(decisionRawValue.user, {
        validators: [Validators.required],
      }),
    });
  }

  getDecision(form: DecisionFormGroup): IDecision | NewDecision {
    return form.getRawValue() as IDecision | NewDecision;
  }

  resetForm(form: DecisionFormGroup, decision: DecisionFormGroupInput): void {
    const decisionRawValue = { ...this.getFormDefaults(), ...decision };
    form.reset(
      {
        ...decisionRawValue,
        id: { value: decisionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DecisionFormDefaults {
    return {
      id: null,
    };
  }
}
