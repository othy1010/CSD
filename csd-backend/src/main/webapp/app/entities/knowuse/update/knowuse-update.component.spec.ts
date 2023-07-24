import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { KnowuseFormService } from './knowuse-form.service';
import { KnowuseService } from '../service/knowuse.service';
import { IKnowuse } from '../knowuse.model';

import { KnowuseUpdateComponent } from './knowuse-update.component';

describe('Knowuse Management Update Component', () => {
  let comp: KnowuseUpdateComponent;
  let fixture: ComponentFixture<KnowuseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let knowuseFormService: KnowuseFormService;
  let knowuseService: KnowuseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [KnowuseUpdateComponent],
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
      .overrideTemplate(KnowuseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KnowuseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    knowuseFormService = TestBed.inject(KnowuseFormService);
    knowuseService = TestBed.inject(KnowuseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const knowuse: IKnowuse = { id: 456 };

      activatedRoute.data = of({ knowuse });
      comp.ngOnInit();

      expect(comp.knowuse).toEqual(knowuse);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IKnowuse>>();
      const knowuse = { id: 123 };
      jest.spyOn(knowuseFormService, 'getKnowuse').mockReturnValue(knowuse);
      jest.spyOn(knowuseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ knowuse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: knowuse }));
      saveSubject.complete();

      // THEN
      expect(knowuseFormService.getKnowuse).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(knowuseService.update).toHaveBeenCalledWith(expect.objectContaining(knowuse));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IKnowuse>>();
      const knowuse = { id: 123 };
      jest.spyOn(knowuseFormService, 'getKnowuse').mockReturnValue({ id: null });
      jest.spyOn(knowuseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ knowuse: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: knowuse }));
      saveSubject.complete();

      // THEN
      expect(knowuseFormService.getKnowuse).toHaveBeenCalled();
      expect(knowuseService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IKnowuse>>();
      const knowuse = { id: 123 };
      jest.spyOn(knowuseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ knowuse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(knowuseService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
