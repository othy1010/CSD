import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CodecisionMethodFormService } from './codecision-method-form.service';
import { CodecisionMethodService } from '../service/codecision-method.service';
import { ICodecisionMethod } from '../codecision-method.model';

import { CodecisionMethodUpdateComponent } from './codecision-method-update.component';

describe('CodecisionMethod Management Update Component', () => {
  let comp: CodecisionMethodUpdateComponent;
  let fixture: ComponentFixture<CodecisionMethodUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let codecisionMethodFormService: CodecisionMethodFormService;
  let codecisionMethodService: CodecisionMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CodecisionMethodUpdateComponent],
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
      .overrideTemplate(CodecisionMethodUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CodecisionMethodUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    codecisionMethodFormService = TestBed.inject(CodecisionMethodFormService);
    codecisionMethodService = TestBed.inject(CodecisionMethodService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const codecisionMethod: ICodecisionMethod = { id: 456 };

      activatedRoute.data = of({ codecisionMethod });
      comp.ngOnInit();

      expect(comp.codecisionMethod).toEqual(codecisionMethod);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICodecisionMethod>>();
      const codecisionMethod = { id: 123 };
      jest.spyOn(codecisionMethodFormService, 'getCodecisionMethod').mockReturnValue(codecisionMethod);
      jest.spyOn(codecisionMethodService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ codecisionMethod });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: codecisionMethod }));
      saveSubject.complete();

      // THEN
      expect(codecisionMethodFormService.getCodecisionMethod).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(codecisionMethodService.update).toHaveBeenCalledWith(expect.objectContaining(codecisionMethod));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICodecisionMethod>>();
      const codecisionMethod = { id: 123 };
      jest.spyOn(codecisionMethodFormService, 'getCodecisionMethod').mockReturnValue({ id: null });
      jest.spyOn(codecisionMethodService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ codecisionMethod: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: codecisionMethod }));
      saveSubject.complete();

      // THEN
      expect(codecisionMethodFormService.getCodecisionMethod).toHaveBeenCalled();
      expect(codecisionMethodService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICodecisionMethod>>();
      const codecisionMethod = { id: 123 };
      jest.spyOn(codecisionMethodService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ codecisionMethod });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(codecisionMethodService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
