import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SelectionCriteriaFormService, SelectionCriteriaFormGroup } from './selection-criteria-form.service';
import { ISelectionCriteria } from '../selection-criteria.model';
import { SelectionCriteriaService } from '../service/selection-criteria.service';
import { IParticipationMethod } from 'app/entities/participation-method/participation-method.model';
import { ParticipationMethodService } from 'app/entities/participation-method/service/participation-method.service';
import { SelectionCriteriaType } from 'app/entities/enumerations/selection-criteria-type.model';

@Component({
  selector: 'jhi-selection-criteria-update',
  templateUrl: './selection-criteria-update.component.html',
})
export class SelectionCriteriaUpdateComponent implements OnInit {
  isSaving = false;
  selectionCriteria: ISelectionCriteria | null = null;
  selectionCriteriaTypeValues = Object.keys(SelectionCriteriaType);

  participationMethodsSharedCollection: IParticipationMethod[] = [];

  editForm: SelectionCriteriaFormGroup = this.selectionCriteriaFormService.createSelectionCriteriaFormGroup();

  constructor(
    protected selectionCriteriaService: SelectionCriteriaService,
    protected selectionCriteriaFormService: SelectionCriteriaFormService,
    protected participationMethodService: ParticipationMethodService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareParticipationMethod = (o1: IParticipationMethod | null, o2: IParticipationMethod | null): boolean =>
    this.participationMethodService.compareParticipationMethod(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ selectionCriteria }) => {
      this.selectionCriteria = selectionCriteria;
      if (selectionCriteria) {
        this.updateForm(selectionCriteria);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const selectionCriteria = this.selectionCriteriaFormService.getSelectionCriteria(this.editForm);
    if (selectionCriteria.id !== null) {
      this.subscribeToSaveResponse(this.selectionCriteriaService.update(selectionCriteria));
    } else {
      this.subscribeToSaveResponse(this.selectionCriteriaService.create(selectionCriteria));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISelectionCriteria>>): void {
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

  protected updateForm(selectionCriteria: ISelectionCriteria): void {
    this.selectionCriteria = selectionCriteria;
    this.selectionCriteriaFormService.resetForm(this.editForm, selectionCriteria);

    this.participationMethodsSharedCollection =
      this.participationMethodService.addParticipationMethodToCollectionIfMissing<IParticipationMethod>(
        this.participationMethodsSharedCollection,
        selectionCriteria.participationMethod
      );
  }

  protected loadRelationshipsOptions(): void {
    this.participationMethodService
      .query()
      .pipe(map((res: HttpResponse<IParticipationMethod[]>) => res.body ?? []))
      .pipe(
        map((participationMethods: IParticipationMethod[]) =>
          this.participationMethodService.addParticipationMethodToCollectionIfMissing<IParticipationMethod>(
            participationMethods,
            this.selectionCriteria?.participationMethod
          )
        )
      )
      .subscribe((participationMethods: IParticipationMethod[]) => (this.participationMethodsSharedCollection = participationMethods));
  }
}
