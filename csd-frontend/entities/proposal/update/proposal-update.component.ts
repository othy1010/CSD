import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ProposalFormService, ProposalFormGroup } from './proposal-form.service';
import { IProposal } from '../proposal.model';
import { ProposalService } from '../service/proposal.service';
import { IInvolvedUser } from 'app/entities/involved-user/involved-user.model';
import { InvolvedUserService } from 'app/entities/involved-user/service/involved-user.service';
import { IRisk } from 'app/entities/risk/risk.model';
import { RiskService } from 'app/entities/risk/service/risk.service';
import { ICollaboration } from 'app/entities/collaboration/collaboration.model';
import { CollaborationService } from 'app/entities/collaboration/service/collaboration.service';
import { ProposalState } from 'app/entities/enumerations/proposal-state.model';

@Component({
  selector: 'csdproposal-update',
  templateUrl: './proposal-update.component.html',
})
export class ProposalUpdateComponent implements OnInit {
  isSaving = false;
  proposal: IProposal | null = null;
  proposalStateValues = Object.keys(ProposalState);

  involvedUsersSharedCollection: IInvolvedUser[] = [];
  risksSharedCollection: IRisk[] = [];
  collaborationsSharedCollection: ICollaboration[] = [];

  editForm: ProposalFormGroup = this.proposalFormService.createProposalFormGroup();

  constructor(
    protected proposalService: ProposalService,
    protected proposalFormService: ProposalFormService,
    protected involvedUserService: InvolvedUserService,
    protected riskService: RiskService,
    protected collaborationService: CollaborationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareInvolvedUser = (o1: IInvolvedUser | null, o2: IInvolvedUser | null): boolean =>
    this.involvedUserService.compareInvolvedUser(o1, o2);

  compareRisk = (o1: IRisk | null, o2: IRisk | null): boolean => this.riskService.compareRisk(o1, o2);

  compareCollaboration = (o1: ICollaboration | null, o2: ICollaboration | null): boolean =>
    this.collaborationService.compareCollaboration(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ proposal }) => {
      this.proposal = proposal;
      if (proposal) {
        this.updateForm(proposal);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const proposal = this.proposalFormService.getProposal(this.editForm);
    if (proposal.id !== null) {
      this.subscribeToSaveResponse(this.proposalService.update(proposal));
    } else {
      this.subscribeToSaveResponse(this.proposalService.create(proposal));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProposal>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(proposal: IProposal): void {
    this.proposal = proposal;
    this.proposalFormService.resetForm(this.editForm, proposal);

    this.involvedUsersSharedCollection = this.involvedUserService.addInvolvedUserToCollectionIfMissing<IInvolvedUser>(
      this.involvedUsersSharedCollection,
      proposal.user
    );
    this.risksSharedCollection = this.riskService.addRiskToCollectionIfMissing<IRisk>(
      this.risksSharedCollection,
      ...(proposal.risks ?? [])
    );
    this.collaborationsSharedCollection = this.collaborationService.addCollaborationToCollectionIfMissing<ICollaboration>(
      this.collaborationsSharedCollection,
      proposal.collaboration
    );
  }

  protected loadRelationshipsOptions(): void {
    this.involvedUserService
      .query()
      .pipe(map((res: HttpResponse<IInvolvedUser[]>) => res.body ?? []))
      .pipe(
        map((involvedUsers: IInvolvedUser[]) =>
          this.involvedUserService.addInvolvedUserToCollectionIfMissing<IInvolvedUser>(involvedUsers, this.proposal?.user)
        )
      )
      .subscribe((involvedUsers: IInvolvedUser[]) => (this.involvedUsersSharedCollection = involvedUsers));

    this.riskService
      .query()
      .pipe(map((res: HttpResponse<IRisk[]>) => res.body ?? []))
      .pipe(map((risks: IRisk[]) => this.riskService.addRiskToCollectionIfMissing<IRisk>(risks, ...(this.proposal?.risks ?? []))))
      .subscribe((risks: IRisk[]) => (this.risksSharedCollection = risks));

    this.collaborationService
      .query()
      .pipe(map((res: HttpResponse<ICollaboration[]>) => res.body ?? []))
      .pipe(
        map((collaborations: ICollaboration[]) =>
          this.collaborationService.addCollaborationToCollectionIfMissing<ICollaboration>(collaborations, this.proposal?.collaboration)
        )
      )
      .subscribe((collaborations: ICollaboration[]) => (this.collaborationsSharedCollection = collaborations));
  }
}
