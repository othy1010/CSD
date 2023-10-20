import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParticipationMethodFormService } from './participation-method-form.service';
import { ParticipationMethodService } from '../service/participation-method.service';
import { IParticipationMethod } from '../participation-method.model';

import { ParticipationMethodUpdateComponent } from './participation-method-update.component';

describe('ParticipationMethod Management Update Component', () => {
  let comp: ParticipationMethodUpdateComponent;
  let fixture: ComponentFixture<ParticipationMethodUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let participationMethodFormService: ParticipationMethodFormService;
  let participationMethodService: ParticipationMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParticipationMethodUpdateComponent],
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
      .overrideTemplate(ParticipationMethodUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParticipationMethodUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    participationMethodFormService = TestBed.inject(ParticipationMethodFormService);
    participationMethodService = TestBed.inject(ParticipationMethodService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const participationMethod: IParticipationMethod = { id: 456 };

      activatedRoute.data = of({ participationMethod });
      comp.ngOnInit();

      expect(comp.participationMethod).toEqual(participationMethod);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParticipationMethod>>();
      const participationMethod = { id: 123 };
      jest.spyOn(participationMethodFormService, 'getParticipationMethod').mockReturnValue(participationMethod);
      jest.spyOn(participationMethodService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ participationMethod });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: participationMethod }));
      saveSubject.complete();

      // THEN
      expect(participationMethodFormService.getParticipationMethod).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(participationMethodService.update).toHaveBeenCalledWith(expect.objectContaining(participationMethod));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParticipationMethod>>();
      const participationMethod = { id: 123 };
      jest.spyOn(participationMethodFormService, 'getParticipationMethod').mockReturnValue({ id: null });
      jest.spyOn(participationMethodService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ participationMethod: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: participationMethod }));
      saveSubject.complete();

      // THEN
      expect(participationMethodFormService.getParticipationMethod).toHaveBeenCalled();
      expect(participationMethodService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParticipationMethod>>();
      const participationMethod = { id: 123 };
      jest.spyOn(participationMethodService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ participationMethod });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(participationMethodService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
