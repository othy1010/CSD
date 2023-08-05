import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IInvolvedUser, NewInvolvedUser } from '../involved-user.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInvolvedUser for edit and NewInvolvedUserFormGroupInput for create.
 */
type InvolvedUserFormGroupInput = IInvolvedUser | PartialWithRequiredKeyOf<NewInvolvedUser>;

type InvolvedUserFormDefaults = Pick<NewInvolvedUser, 'id' | 'isModerator' | 'isEligibleDM'>;

type InvolvedUserFormGroupContent = {
  id: FormControl<IInvolvedUser['id'] | NewInvolvedUser['id']>;
  expertiseLevel: FormControl<IInvolvedUser['expertiseLevel']>;
  userRole: FormControl<IInvolvedUser['userRole']>;
  isModerator: FormControl<IInvolvedUser['isModerator']>;
  isEligibleDM: FormControl<IInvolvedUser['isEligibleDM']>;
  user: FormControl<IInvolvedUser['user']>;
};

export type InvolvedUserFormGroup = FormGroup<InvolvedUserFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InvolvedUserFormService {
  createInvolvedUserFormGroup(involvedUser: InvolvedUserFormGroupInput = { id: null }): InvolvedUserFormGroup {
    const involvedUserRawValue = {
      ...this.getFormDefaults(),
      ...involvedUser,
    };
    return new FormGroup<InvolvedUserFormGroupContent>({
      id: new FormControl(
        { value: involvedUserRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      expertiseLevel: new FormControl(involvedUserRawValue.expertiseLevel),
      userRole: new FormControl(involvedUserRawValue.userRole),
      isModerator: new FormControl(involvedUserRawValue.isModerator),
      isEligibleDM: new FormControl(involvedUserRawValue.isEligibleDM),
      user: new FormControl(involvedUserRawValue.user, {
        validators: [Validators.required],
      }),
    });
  }

  getInvolvedUser(form: InvolvedUserFormGroup): IInvolvedUser | NewInvolvedUser {
    return form.getRawValue() as IInvolvedUser | NewInvolvedUser;
  }

  resetForm(form: InvolvedUserFormGroup, involvedUser: InvolvedUserFormGroupInput): void {
    const involvedUserRawValue = { ...this.getFormDefaults(), ...involvedUser };
    form.reset(
      {
        ...involvedUserRawValue,
        id: { value: involvedUserRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): InvolvedUserFormDefaults {
    return {
      id: null,
      isModerator: false,
      isEligibleDM: false,
    };
  }
}
