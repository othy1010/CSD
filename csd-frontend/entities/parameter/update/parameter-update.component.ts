import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ParameterFormService, ParameterFormGroup } from './parameter-form.service';
import { IParameter } from '../parameter.model';
import { ParameterService } from '../service/parameter.service';
import { IParticipationMethod } from 'app/entities/participation-method/participation-method.model';
import { ParticipationMethodService } from 'app/entities/participation-method/service/participation-method.service';
import { ParameterKind } from 'app/entities/enumerations/parameter-kind.model';

@Component({
  selector: 'csdparameter-update',
  templateUrl: './parameter-update.component.html',
})
export class ParameterUpdateComponent implements OnInit {
  isSaving = false;
  parameter: IParameter | null = null;
  parameterKindValues = Object.keys(ParameterKind);

  participationMethodsSharedCollection: IParticipationMethod[] = [];

  editForm: ParameterFormGroup = this.parameterFormService.createParameterFormGroup();

  constructor(
    protected parameterService: ParameterService,
    protected parameterFormService: ParameterFormService,
    protected participationMethodService: ParticipationMethodService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareParticipationMethod = (o1: IParticipationMethod | null, o2: IParticipationMethod | null): boolean =>
    this.participationMethodService.compareParticipationMethod(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parameter }) => {
      this.parameter = parameter;
      if (parameter) {
        this.updateForm(parameter);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const parameter = this.parameterFormService.getParameter(this.editForm);
    if (parameter.id !== null) {
      this.subscribeToSaveResponse(this.parameterService.update(parameter));
    } else {
      this.subscribeToSaveResponse(this.parameterService.create(parameter));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParameter>>): void {
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

  protected updateForm(parameter: IParameter): void {
    this.parameter = parameter;
    this.parameterFormService.resetForm(this.editForm, parameter);

    this.participationMethodsSharedCollection =
      this.participationMethodService.addParticipationMethodToCollectionIfMissing<IParticipationMethod>(
        this.participationMethodsSharedCollection,
        parameter.participationMethod
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
            this.parameter?.participationMethod
          )
        )
      )
      .subscribe((participationMethods: IParticipationMethod[]) => (this.participationMethodsSharedCollection = participationMethods));
  }
}
