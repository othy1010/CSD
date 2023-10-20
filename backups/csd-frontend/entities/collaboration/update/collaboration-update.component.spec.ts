import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CollaborationFormService } from './collaboration-form.service';
import { CollaborationService } from '../service/collaboration.service';
import { ICollaboration } from '../collaboration.model';
import { IDecisionPattern } from 'app/entities/decision-pattern/decision-pattern.model';
import { DecisionPatternService } from 'app/entities/decision-pattern/service/decision-pattern.service';

import { CollaborationUpdateComponent } from './collaboration-update.component';

describe('Collaboration Management Update Component', () => {
  let comp: CollaborationUpdateComponent;
  let fixture: ComponentFixture<CollaborationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let collaborationFormService: CollaborationFormService;
  let collaborationService: CollaborationService;
  let decisionPatternService: DecisionPatternService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CollaborationUpdateComponent],
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
      .overrideTemplate(CollaborationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CollaborationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    collaborationFormService = TestBed.inject(CollaborationFormService);
    collaborationService = TestBed.inject(CollaborationService);
    decisionPatternService = TestBed.inject(DecisionPatternService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call DecisionPattern query and add missing value', () => {
      const collaboration: ICollaboration = { id: 456 };
      const decisionPattern: IDecisionPattern = { id: 56121 };
      collaboration.decisionPattern = decisionPattern;

      const decisionPatternCollection: IDecisionPattern[] = [{ id: 41937 }];
      jest.spyOn(decisionPatternService, 'query').mockReturnValue(of(new HttpResponse({ body: decisionPatternCollection })));
      const additionalDecisionPatterns = [decisionPattern];
      const expectedCollection: IDecisionPattern[] = [...additionalDecisionPatterns, ...decisionPatternCollection];
      jest.spyOn(decisionPatternService, 'addDecisionPatternToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ collaboration });
      comp.ngOnInit();

      expect(decisionPatternService.query).toHaveBeenCalled();
      expect(decisionPatternService.addDecisionPatternToCollectionIfMissing).toHaveBeenCalledWith(
        decisionPatternCollection,
        ...additionalDecisionPatterns.map(expect.objectContaining)
      );
      expect(comp.decisionPatternsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const collaboration: ICollaboration = { id: 456 };
      const decisionPattern: IDecisionPattern = { id: 49946 };
      collaboration.decisionPattern = decisionPattern;

      activatedRoute.data = of({ collaboration });
      comp.ngOnInit();

      expect(comp.decisionPatternsSharedCollection).toContain(decisionPattern);
      expect(comp.collaboration).toEqual(collaboration);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICollaboration>>();
      const collaboration = { id: 123 };
      jest.spyOn(collaborationFormService, 'getCollaboration').mockReturnValue(collaboration);
      jest.spyOn(collaborationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ collaboration });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: collaboration }));
      saveSubject.complete();

      // THEN
      expect(collaborationFormService.getCollaboration).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(collaborationService.update).toHaveBeenCalledWith(expect.objectContaining(collaboration));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICollaboration>>();
      const collaboration = { id: 123 };
      jest.spyOn(collaborationFormService, 'getCollaboration').mockReturnValue({ id: null });
      jest.spyOn(collaborationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ collaboration: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: collaboration }));
      saveSubject.complete();

      // THEN
      expect(collaborationFormService.getCollaboration).toHaveBeenCalled();
      expect(collaborationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICollaboration>>();
      const collaboration = { id: 123 };
      jest.spyOn(collaborationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ collaboration });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(collaborationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDecisionPattern', () => {
      it('Should forward to decisionPatternService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(decisionPatternService, 'compareDecisionPattern');
        comp.compareDecisionPattern(entity, entity2);
        expect(decisionPatternService.compareDecisionPattern).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
