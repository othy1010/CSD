import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IntentFormService, IntentFormGroup } from './intent-form.service';
import { IIntent } from '../intent.model';
import { IntentService } from '../service/intent.service';

@Component({
  selector: 'jhi-intent-update',
  templateUrl: './intent-update.component.html',
})
export class IntentUpdateComponent implements OnInit {
  isSaving = false;
  intent: IIntent | null = null;

  editForm: IntentFormGroup = this.intentFormService.createIntentFormGroup();

  constructor(
    protected intentService: IntentService,
    protected intentFormService: IntentFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ intent }) => {
      this.intent = intent;
      if (intent) {
        this.updateForm(intent);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const intent = this.intentFormService.getIntent(this.editForm);
    if (intent.id !== null) {
      this.subscribeToSaveResponse(this.intentService.update(intent));
    } else {
      this.subscribeToSaveResponse(this.intentService.create(intent));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIntent>>): void {
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

  protected updateForm(intent: IIntent): void {
    this.intent = intent;
    this.intentFormService.resetForm(this.editForm, intent);
  }
}
