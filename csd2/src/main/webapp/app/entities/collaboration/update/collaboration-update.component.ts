import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CollaborationFormService, CollaborationFormGroup } from './collaboration-form.service';
import { ICollaboration } from '../collaboration.model';
import { CollaborationService } from '../service/collaboration.service';
import { IDecisionPattern } from 'app/entities/decision-pattern/decision-pattern.model';
import { DecisionPatternService } from 'app/entities/decision-pattern/service/decision-pattern.service';
import { CollaborationState } from 'app/entities/enumerations/collaboration-state.model';

@Component({
  selector: 'jhi-collaboration-update',
  templateUrl: './collaboration-update.component.html',
})
export class CollaborationUpdateComponent implements OnInit {
  isSaving = false;
  collaboration: ICollaboration | null = null;
  collaborationStateValues = Object.keys(CollaborationState);

  decisionPatternsSharedCollection: IDecisionPattern[] = [];

  editForm: CollaborationFormGroup = this.collaborationFormService.createCollaborationFormGroup();

  constructor(
    protected collaborationService: CollaborationService,
    protected collaborationFormService: CollaborationFormService,
    protected decisionPatternService: DecisionPatternService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDecisionPattern = (o1: IDecisionPattern | null, o2: IDecisionPattern | null): boolean =>
    this.decisionPatternService.compareDecisionPattern(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ collaboration }) => {
      this.collaboration = collaboration;
      if (collaboration) {
        this.updateForm(collaboration);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const collaboration = this.collaborationFormService.getCollaboration(this.editForm);
    if (collaboration.id !== null) {
      this.subscribeToSaveResponse(this.collaborationService.update(collaboration));
    } else {
      this.subscribeToSaveResponse(this.collaborationService.create(collaboration));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICollaboration>>): void {
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

  protected updateForm(collaboration: ICollaboration): void {
    this.collaboration = collaboration;
    this.collaborationFormService.resetForm(this.editForm, collaboration);

    this.decisionPatternsSharedCollection = this.decisionPatternService.addDecisionPatternToCollectionIfMissing<IDecisionPattern>(
      this.decisionPatternsSharedCollection,
      collaboration.decisionPattern
    );
  }

  protected loadRelationshipsOptions(): void {
    this.decisionPatternService
      .query()
      .pipe(map((res: HttpResponse<IDecisionPattern[]>) => res.body ?? []))
      .pipe(
        map((decisionPatterns: IDecisionPattern[]) =>
          this.decisionPatternService.addDecisionPatternToCollectionIfMissing<IDecisionPattern>(
            decisionPatterns,
            this.collaboration?.decisionPattern
          )
        )
      )
      .subscribe((decisionPatterns: IDecisionPattern[]) => (this.decisionPatternsSharedCollection = decisionPatterns));
  }
}
