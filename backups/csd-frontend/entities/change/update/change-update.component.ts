import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ChangeFormService, ChangeFormGroup } from './change-form.service';
import { IChange } from '../change.model';
import { ChangeService } from '../service/change.service';
import { IProposal } from 'app/entities/proposal/proposal.model';
import { ProposalService } from 'app/entities/proposal/service/proposal.service';
import { ChangeType } from 'app/entities/enumerations/change-type.model';

@Component({
  selector: 'csdchange-update',
  templateUrl: './change-update.component.html',
})
export class ChangeUpdateComponent implements OnInit {
  isSaving = false;
  change: IChange | null = null;
  changeTypeValues = Object.keys(ChangeType);

  proposalsSharedCollection: IProposal[] = [];

  editForm: ChangeFormGroup = this.changeFormService.createChangeFormGroup();

  constructor(
    protected changeService: ChangeService,
    protected changeFormService: ChangeFormService,
    protected proposalService: ProposalService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareProposal = (o1: IProposal | null, o2: IProposal | null): boolean => this.proposalService.compareProposal(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ change }) => {
      this.change = change;
      if (change) {
        this.updateForm(change);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const change = this.changeFormService.getChange(this.editForm);
    if (change.id !== null) {
      this.subscribeToSaveResponse(this.changeService.update(change));
    } else {
      this.subscribeToSaveResponse(this.changeService.create(change));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChange>>): void {
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

  protected updateForm(change: IChange): void {
    this.change = change;
    this.changeFormService.resetForm(this.editForm, change);

    this.proposalsSharedCollection = this.proposalService.addProposalToCollectionIfMissing<IProposal>(
      this.proposalsSharedCollection,
      change.proposal
    );
  }

  protected loadRelationshipsOptions(): void {
    this.proposalService
      .query()
      .pipe(map((res: HttpResponse<IProposal[]>) => res.body ?? []))
      .pipe(
        map((proposals: IProposal[]) => this.proposalService.addProposalToCollectionIfMissing<IProposal>(proposals, this.change?.proposal))
      )
      .subscribe((proposals: IProposal[]) => (this.proposalsSharedCollection = proposals));
  }
}
