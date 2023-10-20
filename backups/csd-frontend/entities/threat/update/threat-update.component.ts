import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ThreatFormService, ThreatFormGroup } from './threat-form.service';
import { IThreat } from '../threat.model';
import { ThreatService } from '../service/threat.service';
import { IVulnerability } from 'app/entities/vulnerability/vulnerability.model';
import { VulnerabilityService } from 'app/entities/vulnerability/service/vulnerability.service';
import { ThreatReference } from 'app/entities/enumerations/threat-reference.model';

@Component({
  selector: 'csdthreat-update',
  templateUrl: './threat-update.component.html',
})
export class ThreatUpdateComponent implements OnInit {
  isSaving = false;
  threat: IThreat | null = null;
  threatReferenceValues = Object.keys(ThreatReference);

  vulnerabilitiesSharedCollection: IVulnerability[] = [];

  editForm: ThreatFormGroup = this.threatFormService.createThreatFormGroup();

  constructor(
    protected threatService: ThreatService,
    protected threatFormService: ThreatFormService,
    protected vulnerabilityService: VulnerabilityService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareVulnerability = (o1: IVulnerability | null, o2: IVulnerability | null): boolean =>
    this.vulnerabilityService.compareVulnerability(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ threat }) => {
      this.threat = threat;
      if (threat) {
        this.updateForm(threat);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const threat = this.threatFormService.getThreat(this.editForm);
    if (threat.id !== null) {
      this.subscribeToSaveResponse(this.threatService.update(threat));
    } else {
      this.subscribeToSaveResponse(this.threatService.create(threat));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IThreat>>): void {
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

  protected updateForm(threat: IThreat): void {
    this.threat = threat;
    this.threatFormService.resetForm(this.editForm, threat);

    this.vulnerabilitiesSharedCollection = this.vulnerabilityService.addVulnerabilityToCollectionIfMissing<IVulnerability>(
      this.vulnerabilitiesSharedCollection,
      ...(threat.vulnerabilities ?? [])
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
            ...(this.threat?.vulnerabilities ?? [])
          )
        )
      )
      .subscribe((vulnerabilities: IVulnerability[]) => (this.vulnerabilitiesSharedCollection = vulnerabilities));
  }
}
