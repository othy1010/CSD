import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ParticipationMethodFormService, ParticipationMethodFormGroup } from './participation-method-form.service';
import { IParticipationMethod } from '../participation-method.model';
import { ParticipationMethodService } from '../service/participation-method.service';
import { ParticipationType } from 'app/entities/enumerations/participation-type.model';

@Component({
  selector: 'csdparticipation-method-update',
  templateUrl: './participation-method-update.component.html',
})
export class ParticipationMethodUpdateComponent implements OnInit {
  isSaving = false;
  participationMethod: IParticipationMethod | null = null;
  participationTypeValues = Object.keys(ParticipationType);

  editForm: ParticipationMethodFormGroup = this.participationMethodFormService.createParticipationMethodFormGroup();

  constructor(
    protected participationMethodService: ParticipationMethodService,
    protected participationMethodFormService: ParticipationMethodFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ participationMethod }) => {
      this.participationMethod = participationMethod;
      if (participationMethod) {
        this.updateForm(participationMethod);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const participationMethod = this.participationMethodFormService.getParticipationMethod(this.editForm);
    if (participationMethod.id !== null) {
      this.subscribeToSaveResponse(this.participationMethodService.update(participationMethod));
    } else {
      this.subscribeToSaveResponse(this.participationMethodService.create(participationMethod));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParticipationMethod>>): void {
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

  protected updateForm(participationMethod: IParticipationMethod): void {
    this.participationMethod = participationMethod;
    this.participationMethodFormService.resetForm(this.editForm, participationMethod);
  }
}
