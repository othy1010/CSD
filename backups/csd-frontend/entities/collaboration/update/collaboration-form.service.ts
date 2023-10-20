import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICollaboration, NewCollaboration } from '../collaboration.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICollaboration for edit and NewCollaborationFormGroupInput for create.
 */
type CollaborationFormGroupInput = ICollaboration | PartialWithRequiredKeyOf<NewCollaboration>;

type CollaborationFormDefaults = Pick<NewCollaboration, 'id'>;

type CollaborationFormGroupContent = {
  id: FormControl<ICollaboration['id'] | NewCollaboration['id']>;
  name: FormControl<ICollaboration['name']>;
  description: FormControl<ICollaboration['description']>;
  startDate: FormControl<ICollaboration['startDate']>;
  decisionDuration: FormControl<ICollaboration['decisionDuration']>;
  evaluationDuration: FormControl<ICollaboration['evaluationDuration']>;
  collaborationState: FormControl<ICollaboration['collaborationState']>;
  decisionPattern: FormControl<ICollaboration['decisionPattern']>;
};

export type CollaborationFormGroup = FormGroup<CollaborationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CollaborationFormService {
  createCollaborationFormGroup(collaboration: CollaborationFormGroupInput = { id: null }): CollaborationFormGroup {
    const collaborationRawValue = {
      ...this.getFormDefaults(),
      ...collaboration,
    };
    return new FormGroup<CollaborationFormGroupContent>({
      id: new FormControl(
        { value: collaborationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(collaborationRawValue.name),
      description: new FormControl(collaborationRawValue.description),
      startDate: new FormControl(collaborationRawValue.startDate),
      decisionDuration: new FormControl(collaborationRawValue.decisionDuration),
      evaluationDuration: new FormControl(collaborationRawValue.evaluationDuration),
      collaborationState: new FormControl(collaborationRawValue.collaborationState),
      decisionPattern: new FormControl(collaborationRawValue.decisionPattern),
    });
  }

  getCollaboration(form: CollaborationFormGroup): ICollaboration | NewCollaboration {
    return form.getRawValue() as ICollaboration | NewCollaboration;
  }

  resetForm(form: CollaborationFormGroup, collaboration: CollaborationFormGroupInput): void {
    const collaborationRawValue = { ...this.getFormDefaults(), ...collaboration };
    form.reset(
      {
        ...collaborationRawValue,
        id: { value: collaborationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CollaborationFormDefaults {
    return {
      id: null,
    };
  }
}
