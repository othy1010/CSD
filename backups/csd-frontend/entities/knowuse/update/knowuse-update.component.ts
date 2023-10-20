import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { KnowuseFormService, KnowuseFormGroup } from './knowuse-form.service';
import { IKnowuse } from '../knowuse.model';
import { KnowuseService } from '../service/knowuse.service';

@Component({
  selector: 'csdknowuse-update',
  templateUrl: './knowuse-update.component.html',
})
export class KnowuseUpdateComponent implements OnInit {
  isSaving = false;
  knowuse: IKnowuse | null = null;

  editForm: KnowuseFormGroup = this.knowuseFormService.createKnowuseFormGroup();

  constructor(
    protected knowuseService: KnowuseService,
    protected knowuseFormService: KnowuseFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ knowuse }) => {
      this.knowuse = knowuse;
      if (knowuse) {
        this.updateForm(knowuse);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const knowuse = this.knowuseFormService.getKnowuse(this.editForm);
    if (knowuse.id !== null) {
      this.subscribeToSaveResponse(this.knowuseService.update(knowuse));
    } else {
      this.subscribeToSaveResponse(this.knowuseService.create(knowuse));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IKnowuse>>): void {
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

  protected updateForm(knowuse: IKnowuse): void {
    this.knowuse = knowuse;
    this.knowuseFormService.resetForm(this.editForm, knowuse);
  }
}
