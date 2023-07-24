import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProposal, NewProposal } from '../proposal.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProposal for edit and NewProposalFormGroupInput for create.
 */
type ProposalFormGroupInput = IProposal | PartialWithRequiredKeyOf<NewProposal>;

type ProposalFormDefaults = Pick<NewProposal, 'id' | 'risks' | 'vulnerabilities'>;

type ProposalFormGroupContent = {
  id: FormControl<IProposal['id'] | NewProposal['id']>;
  name: FormControl<IProposal['name']>;
  description: FormControl<IProposal['description']>;
  creationDate: FormControl<IProposal['creationDate']>;
  proposalState: FormControl<IProposal['proposalState']>;
  user: FormControl<IProposal['user']>;
  risks: FormControl<IProposal['risks']>;
  collaboration: FormControl<IProposal['collaboration']>;
  vulnerabilities: FormControl<IProposal['vulnerabilities']>;
};

export type ProposalFormGroup = FormGroup<ProposalFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProposalFormService {
  createProposalFormGroup(proposal: ProposalFormGroupInput = { id: null }): ProposalFormGroup {
    const proposalRawValue = {
      ...this.getFormDefaults(),
      ...proposal,
    };
    return new FormGroup<ProposalFormGroupContent>({
      id: new FormControl(
        { value: proposalRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(proposalRawValue.name),
      description: new FormControl(proposalRawValue.description),
      creationDate: new FormControl(proposalRawValue.creationDate),
      proposalState: new FormControl(proposalRawValue.proposalState),
      user: new FormControl(proposalRawValue.user, {
        validators: [Validators.required],
      }),
      risks: new FormControl(proposalRawValue.risks ?? []),
      collaboration: new FormControl(proposalRawValue.collaboration),
      vulnerabilities: new FormControl(proposalRawValue.vulnerabilities ?? []),
    });
  }

  getProposal(form: ProposalFormGroup): IProposal | NewProposal {
    return form.getRawValue() as IProposal | NewProposal;
  }

  resetForm(form: ProposalFormGroup, proposal: ProposalFormGroupInput): void {
    const proposalRawValue = { ...this.getFormDefaults(), ...proposal };
    form.reset(
      {
        ...proposalRawValue,
        id: { value: proposalRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ProposalFormDefaults {
    return {
      id: null,
      risks: [],
      vulnerabilities: [],
    };
  }
}
