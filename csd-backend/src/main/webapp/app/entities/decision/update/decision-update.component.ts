import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DecisionFormService, DecisionFormGroup } from './decision-form.service';
import { IDecision } from '../decision.model';
import { DecisionService } from '../service/decision.service';
import { IProposal } from 'app/entities/proposal/proposal.model';
import { ProposalService } from 'app/entities/proposal/service/proposal.service';
import { IInvolvedUser } from 'app/entities/involved-user/involved-user.model';
import { InvolvedUserService } from 'app/entities/involved-user/service/involved-user.service';
import { AgreementType } from 'app/entities/enumerations/agreement-type.model';

@Component({
  selector: 'jhi-decision-update',
  templateUrl: './decision-update.component.html',
})
export class DecisionUpdateComponent implements OnInit {
  isSaving = false;
  decision: IDecision | null = null;
  agreementTypeValues = Object.keys(AgreementType);

  proposalsSharedCollection: IProposal[] = [];
  involvedUsersSharedCollection: IInvolvedUser[] = [];

  editForm: DecisionFormGroup = this.decisionFormService.createDecisionFormGroup();

  constructor(
    protected decisionService: DecisionService,
    protected decisionFormService: DecisionFormService,
    protected proposalService: ProposalService,
    protected involvedUserService: InvolvedUserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareProposal = (o1: IProposal | null, o2: IProposal | null): boolean => this.proposalService.compareProposal(o1, o2);

  compareInvolvedUser = (o1: IInvolvedUser | null, o2: IInvolvedUser | null): boolean =>
    this.involvedUserService.compareInvolvedUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ decision }) => {
      this.decision = decision;
      if (decision) {
        this.updateForm(decision);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const decision = this.decisionFormService.getDecision(this.editForm);
    if (decision.id !== null) {
      this.subscribeToSaveResponse(this.decisionService.update(decision));
    } else {
      this.subscribeToSaveResponse(this.decisionService.create(decision));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDecision>>): void {
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

  protected updateForm(decision: IDecision): void {
    this.decision = decision;
    this.decisionFormService.resetForm(this.editForm, decision);

    this.proposalsSharedCollection = this.proposalService.addProposalToCollectionIfMissing<IProposal>(
      this.proposalsSharedCollection,
      decision.proposal
    );
    this.involvedUsersSharedCollection = this.involvedUserService.addInvolvedUserToCollectionIfMissing<IInvolvedUser>(
      this.involvedUsersSharedCollection,
      decision.user
    );
  }

  protected loadRelationshipsOptions(): void {
    this.proposalService
      .query()
      .pipe(map((res: HttpResponse<IProposal[]>) => res.body ?? []))
      .pipe(
        map((proposals: IProposal[]) =>
          this.proposalService.addProposalToCollectionIfMissing<IProposal>(proposals, this.decision?.proposal)
        )
      )
      .subscribe((proposals: IProposal[]) => (this.proposalsSharedCollection = proposals));

    this.involvedUserService
      .query()
      .pipe(map((res: HttpResponse<IInvolvedUser[]>) => res.body ?? []))
      .pipe(
        map((involvedUsers: IInvolvedUser[]) =>
          this.involvedUserService.addInvolvedUserToCollectionIfMissing<IInvolvedUser>(involvedUsers, this.decision?.user)
        )
      )
      .subscribe((involvedUsers: IInvolvedUser[]) => (this.involvedUsersSharedCollection = involvedUsers));
  }
}
