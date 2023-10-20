import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICodecisionMethod, NewCodecisionMethod } from '../codecision-method.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICodecisionMethod for edit and NewCodecisionMethodFormGroupInput for create.
 */
type CodecisionMethodFormGroupInput = ICodecisionMethod | PartialWithRequiredKeyOf<NewCodecisionMethod>;

type CodecisionMethodFormDefaults = Pick<NewCodecisionMethod, 'id'>;

type CodecisionMethodFormGroupContent = {
  id: FormControl<ICodecisionMethod['id'] | NewCodecisionMethod['id']>;
  processKind: FormControl<ICodecisionMethod['processKind']>;
  evaluationKind: FormControl<ICodecisionMethod['evaluationKind']>;
  agreementThreshold: FormControl<ICodecisionMethod['agreementThreshold']>;
};

export type CodecisionMethodFormGroup = FormGroup<CodecisionMethodFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CodecisionMethodFormService {
  createCodecisionMethodFormGroup(codecisionMethod: CodecisionMethodFormGroupInput = { id: null }): CodecisionMethodFormGroup {
    const codecisionMethodRawValue = {
      ...this.getFormDefaults(),
      ...codecisionMethod,
    };
    return new FormGroup<CodecisionMethodFormGroupContent>({
      id: new FormControl(
        { value: codecisionMethodRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      processKind: new FormControl(codecisionMethodRawValue.processKind),
      evaluationKind: new FormControl(codecisionMethodRawValue.evaluationKind),
      agreementThreshold: new FormControl(codecisionMethodRawValue.agreementThreshold),
    });
  }

  getCodecisionMethod(form: CodecisionMethodFormGroup): ICodecisionMethod | NewCodecisionMethod {
    return form.getRawValue() as ICodecisionMethod | NewCodecisionMethod;
  }

  resetForm(form: CodecisionMethodFormGroup, codecisionMethod: CodecisionMethodFormGroupInput): void {
    const codecisionMethodRawValue = { ...this.getFormDefaults(), ...codecisionMethod };
    form.reset(
      {
        ...codecisionMethodRawValue,
        id: { value: codecisionMethodRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CodecisionMethodFormDefaults {
    return {
      id: null,
    };
  }
}
