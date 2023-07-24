import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DecisionPatternFormService } from './decision-pattern-form.service';
import { DecisionPatternService } from '../service/decision-pattern.service';
import { IDecisionPattern } from '../decision-pattern.model';
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

import { DecisionPatternUpdateComponent } from './decision-pattern-update.component';

describe('DecisionPattern Management Update Component', () => {
  let comp: DecisionPatternUpdateComponent;
  let fixture: ComponentFixture<DecisionPatternUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let decisionPatternFormService: DecisionPatternFormService;
  let decisionPatternService: DecisionPatternService;
  let participationMethodService: ParticipationMethodService;
  let codecisionMethodService: CodecisionMethodService;
  let intentService: IntentService;
  let solutionService: SolutionService;
  let applicationService: ApplicationService;
  let knowuseService: KnowuseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DecisionPatternUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(DecisionPatternUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DecisionPatternUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    decisionPatternFormService = TestBed.inject(DecisionPatternFormService);
    decisionPatternService = TestBed.inject(DecisionPatternService);
    participationMethodService = TestBed.inject(ParticipationMethodService);
    codecisionMethodService = TestBed.inject(CodecisionMethodService);
    intentService = TestBed.inject(IntentService);
    solutionService = TestBed.inject(SolutionService);
    applicationService = TestBed.inject(ApplicationService);
    knowuseService = TestBed.inject(KnowuseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ParticipationMethod query and add missing value', () => {
      const decisionPattern: IDecisionPattern = { id: 456 };
      const participationMethod: IParticipationMethod = { id: 23532 };
      decisionPattern.participationMethod = participationMethod;

      const participationMethodCollection: IParticipationMethod[] = [{ id: 91577 }];
      jest.spyOn(participationMethodService, 'query').mockReturnValue(of(new HttpResponse({ body: participationMethodCollection })));
      const additionalParticipationMethods = [participationMethod];
      const expectedCollection: IParticipationMethod[] = [...additionalParticipationMethods, ...participationMethodCollection];
      jest.spyOn(participationMethodService, 'addParticipationMethodToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ decisionPattern });
      comp.ngOnInit();

      expect(participationMethodService.query).toHaveBeenCalled();
      expect(participationMethodService.addParticipationMethodToCollectionIfMissing).toHaveBeenCalledWith(
        participationMethodCollection,
        ...additionalParticipationMethods.map(expect.objectContaining)
      );
      expect(comp.participationMethodsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call CodecisionMethod query and add missing value', () => {
      const decisionPattern: IDecisionPattern = { id: 456 };
      const codecisionMethod: ICodecisionMethod = { id: 3227 };
      decisionPattern.codecisionMethod = codecisionMethod;

      const codecisionMethodCollection: ICodecisionMethod[] = [{ id: 3327 }];
      jest.spyOn(codecisionMethodService, 'query').mockReturnValue(of(new HttpResponse({ body: codecisionMethodCollection })));
      const additionalCodecisionMethods = [codecisionMethod];
      const expectedCollection: ICodecisionMethod[] = [...additionalCodecisionMethods, ...codecisionMethodCollection];
      jest.spyOn(codecisionMethodService, 'addCodecisionMethodToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ decisionPattern });
      comp.ngOnInit();

      expect(codecisionMethodService.query).toHaveBeenCalled();
      expect(codecisionMethodService.addCodecisionMethodToCollectionIfMissing).toHaveBeenCalledWith(
        codecisionMethodCollection,
        ...additionalCodecisionMethods.map(expect.objectContaining)
      );
      expect(comp.codecisionMethodsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Intent query and add missing value', () => {
      const decisionPattern: IDecisionPattern = { id: 456 };
      const intent: IIntent = { id: 97839 };
      decisionPattern.intent = intent;

      const intentCollection: IIntent[] = [{ id: 32606 }];
      jest.spyOn(intentService, 'query').mockReturnValue(of(new HttpResponse({ body: intentCollection })));
      const additionalIntents = [intent];
      const expectedCollection: IIntent[] = [...additionalIntents, ...intentCollection];
      jest.spyOn(intentService, 'addIntentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ decisionPattern });
      comp.ngOnInit();

      expect(intentService.query).toHaveBeenCalled();
      expect(intentService.addIntentToCollectionIfMissing).toHaveBeenCalledWith(
        intentCollection,
        ...additionalIntents.map(expect.objectContaining)
      );
      expect(comp.intentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Solution query and add missing value', () => {
      const decisionPattern: IDecisionPattern = { id: 456 };
      const solution: ISolution = { id: 33461 };
      decisionPattern.solution = solution;

      const solutionCollection: ISolution[] = [{ id: 35285 }];
      jest.spyOn(solutionService, 'query').mockReturnValue(of(new HttpResponse({ body: solutionCollection })));
      const additionalSolutions = [solution];
      const expectedCollection: ISolution[] = [...additionalSolutions, ...solutionCollection];
      jest.spyOn(solutionService, 'addSolutionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ decisionPattern });
      comp.ngOnInit();

      expect(solutionService.query).toHaveBeenCalled();
      expect(solutionService.addSolutionToCollectionIfMissing).toHaveBeenCalledWith(
        solutionCollection,
        ...additionalSolutions.map(expect.objectContaining)
      );
      expect(comp.solutionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Application query and add missing value', () => {
      const decisionPattern: IDecisionPattern = { id: 456 };
      const application: IApplication = { id: 51517 };
      decisionPattern.application = application;

      const applicationCollection: IApplication[] = [{ id: 93867 }];
      jest.spyOn(applicationService, 'query').mockReturnValue(of(new HttpResponse({ body: applicationCollection })));
      const additionalApplications = [application];
      const expectedCollection: IApplication[] = [...additionalApplications, ...applicationCollection];
      jest.spyOn(applicationService, 'addApplicationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ decisionPattern });
      comp.ngOnInit();

      expect(applicationService.query).toHaveBeenCalled();
      expect(applicationService.addApplicationToCollectionIfMissing).toHaveBeenCalledWith(
        applicationCollection,
        ...additionalApplications.map(expect.objectContaining)
      );
      expect(comp.applicationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Knowuse query and add missing value', () => {
      const decisionPattern: IDecisionPattern = { id: 456 };
      const knowuse: IKnowuse = { id: 44642 };
      decisionPattern.knowuse = knowuse;

      const knowuseCollection: IKnowuse[] = [{ id: 95187 }];
      jest.spyOn(knowuseService, 'query').mockReturnValue(of(new HttpResponse({ body: knowuseCollection })));
      const additionalKnowuses = [knowuse];
      const expectedCollection: IKnowuse[] = [...additionalKnowuses, ...knowuseCollection];
      jest.spyOn(knowuseService, 'addKnowuseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ decisionPattern });
      comp.ngOnInit();

      expect(knowuseService.query).toHaveBeenCalled();
      expect(knowuseService.addKnowuseToCollectionIfMissing).toHaveBeenCalledWith(
        knowuseCollection,
        ...additionalKnowuses.map(expect.objectContaining)
      );
      expect(comp.knowusesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const decisionPattern: IDecisionPattern = { id: 456 };
      const participationMethod: IParticipationMethod = { id: 85065 };
      decisionPattern.participationMethod = participationMethod;
      const codecisionMethod: ICodecisionMethod = { id: 83390 };
      decisionPattern.codecisionMethod = codecisionMethod;
      const intent: IIntent = { id: 93871 };
      decisionPattern.intent = intent;
      const solution: ISolution = { id: 2532 };
      decisionPattern.solution = solution;
      const application: IApplication = { id: 42306 };
      decisionPattern.application = application;
      const knowuse: IKnowuse = { id: 13550 };
      decisionPattern.knowuse = knowuse;

      activatedRoute.data = of({ decisionPattern });
      comp.ngOnInit();

      expect(comp.participationMethodsSharedCollection).toContain(participationMethod);
      expect(comp.codecisionMethodsSharedCollection).toContain(codecisionMethod);
      expect(comp.intentsSharedCollection).toContain(intent);
      expect(comp.solutionsSharedCollection).toContain(solution);
      expect(comp.applicationsSharedCollection).toContain(application);
      expect(comp.knowusesSharedCollection).toContain(knowuse);
      expect(comp.decisionPattern).toEqual(decisionPattern);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecisionPattern>>();
      const decisionPattern = { id: 123 };
      jest.spyOn(decisionPatternFormService, 'getDecisionPattern').mockReturnValue(decisionPattern);
      jest.spyOn(decisionPatternService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decisionPattern });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: decisionPattern }));
      saveSubject.complete();

      // THEN
      expect(decisionPatternFormService.getDecisionPattern).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(decisionPatternService.update).toHaveBeenCalledWith(expect.objectContaining(decisionPattern));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecisionPattern>>();
      const decisionPattern = { id: 123 };
      jest.spyOn(decisionPatternFormService, 'getDecisionPattern').mockReturnValue({ id: null });
      jest.spyOn(decisionPatternService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decisionPattern: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: decisionPattern }));
      saveSubject.complete();

      // THEN
      expect(decisionPatternFormService.getDecisionPattern).toHaveBeenCalled();
      expect(decisionPatternService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecisionPattern>>();
      const decisionPattern = { id: 123 };
      jest.spyOn(decisionPatternService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decisionPattern });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(decisionPatternService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareParticipationMethod', () => {
      it('Should forward to participationMethodService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(participationMethodService, 'compareParticipationMethod');
        comp.compareParticipationMethod(entity, entity2);
        expect(participationMethodService.compareParticipationMethod).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCodecisionMethod', () => {
      it('Should forward to codecisionMethodService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(codecisionMethodService, 'compareCodecisionMethod');
        comp.compareCodecisionMethod(entity, entity2);
        expect(codecisionMethodService.compareCodecisionMethod).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareIntent', () => {
      it('Should forward to intentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(intentService, 'compareIntent');
        comp.compareIntent(entity, entity2);
        expect(intentService.compareIntent).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSolution', () => {
      it('Should forward to solutionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(solutionService, 'compareSolution');
        comp.compareSolution(entity, entity2);
        expect(solutionService.compareSolution).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareApplication', () => {
      it('Should forward to applicationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(applicationService, 'compareApplication');
        comp.compareApplication(entity, entity2);
        expect(applicationService.compareApplication).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareKnowuse', () => {
      it('Should forward to knowuseService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(knowuseService, 'compareKnowuse');
        comp.compareKnowuse(entity, entity2);
        expect(knowuseService.compareKnowuse).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
