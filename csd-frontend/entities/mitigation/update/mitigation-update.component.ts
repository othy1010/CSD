import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MitigationFormService, MitigationFormGroup } from './mitigation-form.service';
import { IMitigation } from '../mitigation.model';
import { MitigationService } from '../service/mitigation.service';
import { IVulnerability } from 'app/entities/vulnerability/vulnerability.model';
import { VulnerabilityService } from 'app/entities/vulnerability/service/vulnerability.service';

@Component({
  selector: 'csdmitigation-update',
  templateUrl: './mitigation-update.component.html',
})
export class MitigationUpdateComponent implements OnInit {
  isSaving = false;
  mitigation: IMitigation | null = null;

  vulnerabilitiesSharedCollection: IVulnerability[] = [];

  editForm: MitigationFormGroup = this.mitigationFormService.createMitigationFormGroup();

  constructor(
    protected mitigationService: MitigationService,
    protected mitigationFormService: MitigationFormService,
    protected vulnerabilityService: VulnerabilityService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareVulnerability = (o1: IVulnerability | null, o2: IVulnerability | null): boolean =>
    this.vulnerabilityService.compareVulnerability(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mitigation }) => {
      this.mitigation = mitigation;
      if (mitigation) {
        this.updateForm(mitigation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mitigation = this.mitigationFormService.getMitigation(this.editForm);
    if (mitigation.id !== null) {
      this.subscribeToSaveResponse(this.mitigationService.update(mitigation));
    } else {
      this.subscribeToSaveResponse(this.mitigationService.create(mitigation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMitigation>>): void {
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

  protected updateForm(mitigation: IMitigation): void {
    this.mitigation = mitigation;
    this.mitigationFormService.resetForm(this.editForm, mitigation);

    this.vulnerabilitiesSharedCollection = this.vulnerabilityService.addVulnerabilityToCollectionIfMissing<IVulnerability>(
      this.vulnerabilitiesSharedCollection,
      ...(mitigation.vulnerabilities ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.vulnerabilityService
      .query()
      .pipe(map((res: HttpResponse<IVulnerability[]>) => res.body ?? []))
      .pipe(
        map((vulnerabilities: IVulnerability[]) =>
          this.vulnerabilityService.addVulnerabilityToCollectionIfMissing<IVulnerability>(
            vulnerabilities,
            ...(this.mitigation?.vulnerabilities ?? [])
          )
        )
      )
      .subscribe((vulnerabilities: IVulnerability[]) => (this.vulnerabilitiesSharedCollection = vulnerabilities));
  }
}
