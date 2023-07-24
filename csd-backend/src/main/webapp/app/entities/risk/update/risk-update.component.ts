import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { RiskFormService, RiskFormGroup } from './risk-form.service';
import { IRisk } from '../risk.model';
import { RiskService } from '../service/risk.service';
import { Severity } from 'app/entities/enumerations/severity.model';

@Component({
  selector: 'jhi-risk-update',
  templateUrl: './risk-update.component.html',
})
export class RiskUpdateComponent implements OnInit {
  isSaving = false;
  risk: IRisk | null = null;
  severityValues = Object.keys(Severity);

  editForm: RiskFormGroup = this.riskFormService.createRiskFormGroup();

  constructor(protected riskService: RiskService, protected riskFormService: RiskFormService, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ risk }) => {
      this.risk = risk;
      if (risk) {
        this.updateForm(risk);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const risk = this.riskFormService.getRisk(this.editForm);
    if (risk.id !== null) {
      this.subscribeToSaveResponse(this.riskService.update(risk));
    } else {
      this.subscribeToSaveResponse(this.riskService.create(risk));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRisk>>): void {
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

  protected updateForm(risk: IRisk): void {
    this.risk = risk;
    this.riskFormService.resetForm(this.editForm, risk);
  }
}
