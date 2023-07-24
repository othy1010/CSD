import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IIntent, NewIntent } from '../intent.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IIntent for edit and NewIntentFormGroupInput for create.
 */
type IntentFormGroupInput = IIntent | PartialWithRequiredKeyOf<NewIntent>;

type IntentFormDefaults = Pick<NewIntent, 'id'>;

type IntentFormGroupContent = {
  id: FormControl<IIntent['id'] | NewIntent['id']>;
  name: FormControl<IIntent['name']>;
  description: FormControl<IIntent['description']>;
};

export type IntentFormGroup = FormGroup<IntentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class IntentFormService {
  createIntentFormGroup(intent: IntentFormGroupInput = { id: null }): IntentFormGroup {
    const intentRawValue = {
      ...this.getFormDefaults(),
      ...intent,
    };
    return new FormGroup<IntentFormGroupContent>({
      id: new FormControl(
        { value: intentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(intentRawValue.name),
      description: new FormControl(intentRawValue.description),
    });
  }

  getIntent(form: IntentFormGroup): IIntent | NewIntent {
    return form.getRawValue() as IIntent | NewIntent;
  }

  resetForm(form: IntentFormGroup, intent: IntentFormGroupInput): void {
    const intentRawValue = { ...this.getFormDefaults(), ...intent };
    form.reset(
      {
        ...intentRawValue,
        id: { value: intentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): IntentFormDefaults {
    return {
      id: null,
    };
  }
}
