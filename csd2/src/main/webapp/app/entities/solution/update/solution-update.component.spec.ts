import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SolutionFormService } from './solution-form.service';
import { SolutionService } from '../service/solution.service';
import { ISolution } from '../solution.model';

import { SolutionUpdateComponent } from './solution-update.component';

describe('Solution Management Update Component', () => {
  let comp: SolutionUpdateComponent;
  let fixture: ComponentFixture<SolutionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let solutionFormService: SolutionFormService;
  let solutionService: SolutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SolutionUpdateComponent],
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
      .overrideTemplate(SolutionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SolutionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    solutionFormService = TestBed.inject(SolutionFormService);
    solutionService = TestBed.inject(SolutionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const solution: ISolution = { id: 456 };

      activatedRoute.data = of({ solution });
      comp.ngOnInit();

      expect(comp.solution).toEqual(solution);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISolution>>();
      const solution = { id: 123 };
      jest.spyOn(solutionFormService, 'getSolution').mockReturnValue(solution);
      jest.spyOn(solutionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ solution });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: solution }));
      saveSubject.complete();

      // THEN
      expect(solutionFormService.getSolution).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(solutionService.update).toHaveBeenCalledWith(expect.objectContaining(solution));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISolution>>();
      const solution = { id: 123 };
      jest.spyOn(solutionFormService, 'getSolution').mockReturnValue({ id: null });
      jest.spyOn(solutionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ solution: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: solution }));
      saveSubject.complete();

      // THEN
      expect(solutionFormService.getSolution).toHaveBeenCalled();
      expect(solutionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISolution>>();
      const solution = { id: 123 };
      jest.spyOn(solutionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ solution });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(solutionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
