import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RiskFormService } from './risk-form.service';
import { RiskService } from '../service/risk.service';
import { IRisk } from '../risk.model';

import { RiskUpdateComponent } from './risk-update.component';

describe('Risk Management Update Component', () => {
  let comp: RiskUpdateComponent;
  let fixture: ComponentFixture<RiskUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let riskFormService: RiskFormService;
  let riskService: RiskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RiskUpdateComponent],
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
      .overrideTemplate(RiskUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RiskUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    riskFormService = TestBed.inject(RiskFormService);
    riskService = TestBed.inject(RiskService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const risk: IRisk = { id: 456 };

      activatedRoute.data = of({ risk });
      comp.ngOnInit();

      expect(comp.risk).toEqual(risk);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRisk>>();
      const risk = { id: 123 };
      jest.spyOn(riskFormService, 'getRisk').mockReturnValue(risk);
      jest.spyOn(riskService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ risk });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: risk }));
      saveSubject.complete();

      // THEN
      expect(riskFormService.getRisk).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(riskService.update).toHaveBeenCalledWith(expect.objectContaining(risk));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRisk>>();
      const risk = { id: 123 };
      jest.spyOn(riskFormService, 'getRisk').mockReturnValue({ id: null });
      jest.spyOn(riskService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ risk: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: risk }));
      saveSubject.complete();

      // THEN
      expect(riskFormService.getRisk).toHaveBeenCalled();
      expect(riskService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRisk>>();
      const risk = { id: 123 };
      jest.spyOn(riskService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ risk });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(riskService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
