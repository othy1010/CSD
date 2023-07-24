import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CodecisionMethodFormService, CodecisionMethodFormGroup } from './codecision-method-form.service';
import { ICodecisionMethod } from '../codecision-method.model';
import { CodecisionMethodService } from '../service/codecision-method.service';
import { ProcessKind } from 'app/entities/enumerations/process-kind.model';
import { EvaluationKind } from 'app/entities/enumerations/evaluation-kind.model';
import { AgreementThreshold } from 'app/entities/enumerations/agreement-threshold.model';

@Component({
  selector: 'jhi-codecision-method-update',
  templateUrl: './codecision-method-update.component.html',
})
export class CodecisionMethodUpdateComponent implements OnInit {
  isSaving = false;
  codecisionMethod: ICodecisionMethod | null = null;
  processKindValues = Object.keys(ProcessKind);
  evaluationKindValues = Object.keys(EvaluationKind);
  agreementThresholdValues = Object.keys(AgreementThreshold);

  editForm: CodecisionMethodFormGroup = this.codecisionMethodFormService.createCodecisionMethodFormGroup();

  constructor(
    protected codecisionMethodService: CodecisionMethodService,
    protected codecisionMethodFormService: CodecisionMethodFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ codecisionMethod }) => {
      this.codecisionMethod = codecisionMethod;
      if (codecisionMethod) {
        this.updateForm(codecisionMethod);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const codecisionMethod = this.codecisionMethodFormService.getCodecisionMethod(this.editForm);
    if (codecisionMethod.id !== null) {
      this.subscribeToSaveResponse(this.codecisionMethodService.update(codecisionMethod));
    } else {
      this.subscribeToSaveResponse(this.codecisionMethodService.create(codecisionMethod));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICodecisionMethod>>): void {
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

  protected updateForm(codecisionMethod: ICodecisionMethod): void {
    this.codecisionMethod = codecisionMethod;
    this.codecisionMethodFormService.resetForm(this.editForm, codecisionMethod);
  }
}
