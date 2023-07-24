import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DecisionPatternFormService, DecisionPatternFormGroup } from './decision-pattern-form.service';
import { IDecisionPattern } from '../decision-pattern.model';
import { DecisionPatternService } from '../service/decision-pattern.service';
import { IParticipationMethod } from 'app/entities/participation-method/participation-method.model';
import { ParticipationMethodService } from 'app/entities/participation-method/service/participation-method.service';
import { ICodecisionMethod } from 'app/entities/codecision-method/codecision-method.model';
import { CodecisionMethodService } from 'app/entities/codecision-method/service/codecision-method.service';
import { IIntent } from 'app/entities/intent/intent.model';
import { IntentService } from 'app/entities/intent/service/intent.service';
import { ISolution } from 'app/entities/solution/solution.model';
import { SolutionService } from 'app/entities/solution/service/solution.service';
import { IApplication } from 'app/entities/application/application.model';
import { ApplicationService } from 'app/entities/application/service/application.service';
import { IKnowuse } from 'app/entities/knowuse/knowuse.model';
import { KnowuseService } from 'app/entities/knowuse/service/knowuse.service';

@Component({
  selector: 'jhi-decision-pattern-update',
  templateUrl: './decision-pattern-update.component.html',
})
export class DecisionPatternUpdateComponent implements OnInit {
  isSaving = false;
  decisionPattern: IDecisionPattern | null = null;

  participationMethodsSharedCollection: IParticipationMethod[] = [];
  codecisionMethodsSharedCollection: ICodecisionMethod[] = [];
  intentsSharedCollection: IIntent[] = [];
  solutionsSharedCollection: ISolution[] = [];
  applicationsSharedCollection: IApplication[] = [];
  knowusesSharedCollection: IKnowuse[] = [];

  editForm: DecisionPatternFormGroup = this.decisionPatternFormService.createDecisionPatternFormGroup();

  constructor(
    protected decisionPatternService: DecisionPatternService,
    protected decisionPatternFormService: DecisionPatternFormService,
    protected participationMethodService: ParticipationMethodService,
    protected codecisionMethodService: CodecisionMethodService,
    protected intentService: IntentService,
    protected solutionService: SolutionService,
    protected applicationService: ApplicationService,
    protected knowuseService: KnowuseService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareParticipationMethod = (o1: IParticipationMethod | null, o2: IParticipationMethod | null): boolean =>
    this.participationMethodService.compareParticipationMethod(o1, o2);

  compareCodecisionMethod = (o1: ICodecisionMethod | null, o2: ICodecisionMethod | null): boolean =>
    this.codecisionMethodService.compareCodecisionMethod(o1, o2);

  compareIntent = (o1: IIntent | null, o2: IIntent | null): boolean => this.intentService.compareIntent(o1, o2);

  compareSolution = (o1: ISolution | null, o2: ISolution | null): boolean => this.solutionService.compareSolution(o1, o2);

  compareApplication = (o1: IApplication | null, o2: IApplication | null): boolean => this.applicationService.compareApplication(o1, o2);

  compareKnowuse = (o1: IKnowuse | null, o2: IKnowuse | null): boolean => this.knowuseService.compareKnowuse(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ decisionPattern }) => {
      this.decisionPattern = decisionPattern;
      if (decisionPattern) {
        this.updateForm(decisionPattern);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const decisionPattern = this.decisionPatternFormService.getDecisionPattern(this.editForm);
    if (decisionPattern.id !== null) {
      this.subscribeToSaveResponse(this.decisionPatternService.update(decisionPattern));
    } else {
      this.subscribeToSaveResponse(this.decisionPatternService.create(decisionPattern));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDecisionPattern>>): void {
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

  protected updateForm(decisionPattern: IDecisionPattern): void {
    this.decisionPattern = decisionPattern;
    this.decisionPatternFormService.resetForm(this.editForm, decisionPattern);

    this.participationMethodsSharedCollection =
      this.participationMethodService.addParticipationMethodToCollectionIfMissing<IParticipationMethod>(
        this.participationMethodsSharedCollection,
        decisionPattern.participationMethod
      );
    this.codecisionMethodsSharedCollection = this.codecisionMethodService.addCodecisionMethodToCollectionIfMissing<ICodecisionMethod>(
      this.codecisionMethodsSharedCollection,
      decisionPattern.codecisionMethod
    );
    this.intentsSharedCollection = this.intentService.addIntentToCollectionIfMissing<IIntent>(
      this.intentsSharedCollection,
      decisionPattern.intent
    );
    this.solutionsSharedCollection = this.solutionService.addSolutionToCollectionIfMissing<ISolution>(
      this.solutionsSharedCollection,
      decisionPattern.solution
    );
    this.applicationsSharedCollection = this.applicationService.addApplicationToCollectionIfMissing<IApplication>(
      this.applicationsSharedCollection,
      decisionPattern.application
    );
    this.knowusesSharedCollection = this.knowuseService.addKnowuseToCollectionIfMissing<IKnowuse>(
      this.knowusesSharedCollection,
      decisionPattern.knowuse
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
            this.decisionPattern?.participationMethod
          )
        )
      )
      .subscribe((participationMethods: IParticipationMethod[]) => (this.participationMethodsSharedCollection = participationMethods));

    this.codecisionMethodService
      .query()
      .pipe(map((res: HttpResponse<ICodecisionMethod[]>) => res.body ?? []))
      .pipe(
        map((codecisionMethods: ICodecisionMethod[]) =>
          this.codecisionMethodService.addCodecisionMethodToCollectionIfMissing<ICodecisionMethod>(
            codecisionMethods,
            this.decisionPattern?.codecisionMethod
          )
        )
      )
      .subscribe((codecisionMethods: ICodecisionMethod[]) => (this.codecisionMethodsSharedCollection = codecisionMethods));

    this.intentService
      .query()
      .pipe(map((res: HttpResponse<IIntent[]>) => res.body ?? []))
      .pipe(map((intents: IIntent[]) => this.intentService.addIntentToCollectionIfMissing<IIntent>(intents, this.decisionPattern?.intent)))
      .subscribe((intents: IIntent[]) => (this.intentsSharedCollection = intents));

    this.solutionService
      .query()
      .pipe(map((res: HttpResponse<ISolution[]>) => res.body ?? []))
      .pipe(
        map((solutions: ISolution[]) =>
          this.solutionService.addSolutionToCollectionIfMissing<ISolution>(solutions, this.decisionPattern?.solution)
        )
      )
      .subscribe((solutions: ISolution[]) => (this.solutionsSharedCollection = solutions));

    this.applicationService
      .query()
      .pipe(map((res: HttpResponse<IApplication[]>) => res.body ?? []))
      .pipe(
        map((applications: IApplication[]) =>
          this.applicationService.addApplicationToCollectionIfMissing<IApplication>(applications, this.decisionPattern?.application)
        )
      )
      .subscribe((applications: IApplication[]) => (this.applicationsSharedCollection = applications));

    this.knowuseService
      .query()
      .pipe(map((res: HttpResponse<IKnowuse[]>) => res.body ?? []))
      .pipe(
        map((knowuses: IKnowuse[]) =>
          this.knowuseService.addKnowuseToCollectionIfMissing<IKnowuse>(knowuses, this.decisionPattern?.knowuse)
        )
      )
      .subscribe((knowuses: IKnowuse[]) => (this.knowusesSharedCollection = knowuses));
  }
}
