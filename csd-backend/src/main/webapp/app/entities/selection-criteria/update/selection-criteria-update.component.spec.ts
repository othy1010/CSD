import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SelectionCriteriaFormService } from './selection-criteria-form.service';
import { SelectionCriteriaService } from '../service/selection-criteria.service';
import { ISelectionCriteria } from '../selection-criteria.model';
import { IParticipationMethod } from 'app/entities/participation-method/participation-method.model';
import { ParticipationMethodService } from 'app/entities/participation-method/service/participation-method.service';

import { SelectionCriteriaUpdateComponent } from './selection-criteria-update.component';

describe('SelectionCriteria Management Update Component', () => {
  let comp: SelectionCriteriaUpdateComponent;
  let fixture: ComponentFixture<SelectionCriteriaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let selectionCriteriaFormService: SelectionCriteriaFormService;
  let selectionCriteriaService: SelectionCriteriaService;
  let participationMethodService: ParticipationMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SelectionCriteriaUpdateComponent],
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
      .overrideTemplate(SelectionCriteriaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SelectionCriteriaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    selectionCriteriaFormService = TestBed.inject(SelectionCriteriaFormService);
    selectionCriteriaService = TestBed.inject(SelectionCriteriaService);
    participationMethodService = TestBed.inject(ParticipationMethodService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ParticipationMethod query and add missing value', () => {
      const selectionCriteria: ISelectionCriteria = { id: 456 };
      const participationMethod: IParticipationMethod = { id: 67262 };
      selectionCriteria.participationMethod = participationMethod;

      const participationMethodCollection: IParticipationMethod[] = [{ id: 82814 }];
      jest.spyOn(participationMethodService, 'query').mockReturnValue(of(new HttpResponse({ body: participationMethodCollection })));
      const additionalParticipationMethods = [participationMethod];
      const expectedCollection: IParticipationMethod[] = [...additionalParticipationMethods, ...participationMethodCollection];
      jest.spyOn(participationMethodService, 'addParticipationMethodToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ selectionCriteria });
      comp.ngOnInit();

      expect(participationMethodService.query).toHaveBeenCalled();
      expect(participationMethodService.addParticipationMethodToCollectionIfMissing).toHaveBeenCalledWith(
        participationMethodCollection,
        ...additionalParticipationMethods.map(expect.objectContaining)
      );
      expect(comp.participationMethodsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const selectionCriteria: ISelectionCriteria = { id: 456 };
      const participationMethod: IParticipationMethod = { id: 7255 };
      selectionCriteria.participationMethod = participationMethod;

      activatedRoute.data = of({ selectionCriteria });
      comp.ngOnInit();

      expect(comp.participationMethodsSharedCollection).toContain(participationMethod);
      expect(comp.selectionCriteria).toEqual(selectionCriteria);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISelectionCriteria>>();
      const selectionCriteria = { id: 123 };
      jest.spyOn(selectionCriteriaFormService, 'getSelectionCriteria').mockReturnValue(selectionCriteria);
      jest.spyOn(selectionCriteriaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ selectionCriteria });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: selectionCriteria }));
      saveSubject.complete();

      // THEN
      expect(selectionCriteriaFormService.getSelectionCriteria).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(selectionCriteriaService.update).toHaveBeenCalledWith(expect.objectContaining(selectionCriteria));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISelectionCriteria>>();
      const selectionCriteria = { id: 123 };
      jest.spyOn(selectionCriteriaFormService, 'getSelectionCriteria').mockReturnValue({ id: null });
      jest.spyOn(selectionCriteriaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ selectionCriteria: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: selectionCriteria }));
      saveSubject.complete();

      // THEN
      expect(selectionCriteriaFormService.getSelectionCriteria).toHaveBeenCalled();
      expect(selectionCriteriaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISelectionCriteria>>();
      const selectionCriteria = { id: 123 };
      jest.spyOn(selectionCriteriaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ selectionCriteria });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(selectionCriteriaService.update).toHaveBeenCalled();
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
  });
});
