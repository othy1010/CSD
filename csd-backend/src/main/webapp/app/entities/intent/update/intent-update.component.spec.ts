import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IntentFormService } from './intent-form.service';
import { IntentService } from '../service/intent.service';
import { IIntent } from '../intent.model';

import { IntentUpdateComponent } from './intent-update.component';

describe('Intent Management Update Component', () => {
  let comp: IntentUpdateComponent;
  let fixture: ComponentFixture<IntentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let intentFormService: IntentFormService;
  let intentService: IntentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [IntentUpdateComponent],
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
      .overrideTemplate(IntentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IntentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    intentFormService = TestBed.inject(IntentFormService);
    intentService = TestBed.inject(IntentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const intent: IIntent = { id: 456 };

      activatedRoute.data = of({ intent });
      comp.ngOnInit();

      expect(comp.intent).toEqual(intent);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIntent>>();
      const intent = { id: 123 };
      jest.spyOn(intentFormService, 'getIntent').mockReturnValue(intent);
      jest.spyOn(intentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ intent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: intent }));
      saveSubject.complete();

      // THEN
      expect(intentFormService.getIntent).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(intentService.update).toHaveBeenCalledWith(expect.objectContaining(intent));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIntent>>();
      const intent = { id: 123 };
      jest.spyOn(intentFormService, 'getIntent').mockReturnValue({ id: null });
      jest.spyOn(intentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ intent: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: intent }));
      saveSubject.complete();

      // THEN
      expect(intentFormService.getIntent).toHaveBeenCalled();
      expect(intentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIntent>>();
      const intent = { id: 123 };
      jest.spyOn(intentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ intent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(intentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
