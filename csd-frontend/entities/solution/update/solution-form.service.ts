import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISolution, NewSolution } from '../solution.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISolution for edit and NewSolutionFormGroupInput for create.
 */
type SolutionFormGroupInput = ISolution | PartialWithRequiredKeyOf<NewSolution>;

type SolutionFormDefaults = Pick<NewSolution, 'id'>;

type SolutionFormGroupContent = {
  id: FormControl<ISolution['id'] | NewSolution['id']>;
  name: FormControl<ISolution['name']>;
  description: FormControl<ISolution['description']>;
};

export type SolutionFormGroup = FormGroup<SolutionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SolutionFormService {
  createSolutionFormGroup(solution: SolutionFormGroupInput = { id: null }): SolutionFormGroup {
    const solutionRawValue = {
      ...this.getFormDefaults(),
      ...solution,
    };
    return new FormGroup<SolutionFormGroupContent>({
      id: new FormControl(
        { value: solutionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(solutionRawValue.name),
      description: new FormControl(solutionRawValue.description),
    });
  }

  getSolution(form: SolutionFormGroup): ISolution | NewSolution {
    return form.getRawValue() as ISolution | NewSolution;
  }

  resetForm(form: SolutionFormGroup, solution: SolutionFormGroupInput): void {
    const solutionRawValue = { ...this.getFormDefaults(), ...solution };
    form.reset(
      {
        ...solutionRawValue,
        id: { value: solutionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SolutionFormDefaults {
    return {
      id: null,
    };
  }
}
