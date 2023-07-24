import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParameterFormService } from './parameter-form.service';
import { ParameterService } from '../service/parameter.service';
import { IParameter } from '../parameter.model';
import { IParticipationMethod } from 'app/entities/participation-method/participation-method.model';
import { ParticipationMethodService } from 'app/entities/participation-method/service/participation-method.service';

import { ParameterUpdateComponent } from './parameter-update.component';

describe('Parameter Management Update Component', () => {
  let comp: ParameterUpdateComponent;
  let fixture: ComponentFixture<ParameterUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let parameterFormService: ParameterFormService;
  let parameterService: ParameterService;
  let participationMethodService: ParticipationMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParameterUpdateComponent],
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
      .overrideTemplate(ParameterUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParameterUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    parameterFormService = TestBed.inject(ParameterFormService);
    parameterService = TestBed.inject(ParameterService);
    participationMethodService = TestBed.inject(ParticipationMethodService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ParticipationMethod query and add missing value', () => {
      const parameter: IParameter = { id: 456 };
      const participationMethod: IParticipationMethod = { id: 11425 };
      parameter.participationMethod = participationMethod;

      const participationMethodCollection: IParticipationMethod[] = [{ id: 43233 }];
      jest.spyOn(participationMethodService, 'query').mockReturnValue(of(new HttpResponse({ body: participationMethodCollection })));
      const additionalParticipationMethods = [participationMethod];
      const expectedCollection: IParticipationMethod[] = [...additionalParticipationMethods, ...participationMethodCollection];
      jest.spyOn(participationMethodService, 'addParticipationMethodToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ parameter });
      comp.ngOnInit();

      expect(participationMethodService.query).toHaveBeenCalled();
      expect(participationMethodService.addParticipationMethodToCollectionIfMissing).toHaveBeenCalledWith(
        participationMethodCollection,
        ...additionalParticipationMethods.map(expect.objectContaining)
      );
      expect(comp.participationMethodsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const parameter: IParameter = { id: 456 };
      const participationMethod: IParticipationMethod = { id: 15171 };
      parameter.participationMethod = participationMethod;

      activatedRoute.data = of({ parameter });
      comp.ngOnInit();

      expect(comp.participationMethodsSharedCollection).toContain(participationMethod);
      expect(comp.parameter).toEqual(parameter);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParameter>>();
      const parameter = { id: 123 };
      jest.spyOn(parameterFormService, 'getParameter').mockReturnValue(parameter);
      jest.spyOn(parameterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parameter });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parameter }));
      saveSubject.complete();

      // THEN
      expect(parameterFormService.getParameter).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(parameterService.update).toHaveBeenCalledWith(expect.objectContaining(parameter));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParameter>>();
      const parameter = { id: 123 };
      jest.spyOn(parameterFormService, 'getParameter').mockReturnValue({ id: null });
      jest.spyOn(parameterService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parameter: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parameter }));
      saveSubject.complete();

      // THEN
      expect(parameterFormService.getParameter).toHaveBeenCalled();
      expect(parameterService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParameter>>();
      const parameter = { id: 123 };
      jest.spyOn(parameterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parameter });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(parameterService.update).toHaveBeenCalled();
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
