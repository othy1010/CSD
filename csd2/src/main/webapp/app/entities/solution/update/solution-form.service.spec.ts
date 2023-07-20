import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../solution.test-samples';

import { SolutionFormService } from './solution-form.service';

describe('Solution Form Service', () => {
  let service: SolutionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolutionFormService);
  });

  describe('Service methods', () => {
    describe('createSolutionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSolutionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });

      it('passing ISolution should create a new form with FormGroup', () => {
        const formGroup = service.createSolutionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });
    });

    describe('getSolution', () => {
      it('should return NewSolution for default Solution initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSolutionFormGroup(sampleWithNewData);

        const solution = service.getSolution(formGroup) as any;

        expect(solution).toMatchObject(sampleWithNewData);
      });

      it('should return NewSolution for empty Solution initial value', () => {
        const formGroup = service.createSolutionFormGroup();

        const solution = service.getSolution(formGroup) as any;

        expect(solution).toMatchObject({});
      });

      it('should return ISolution', () => {
        const formGroup = service.createSolutionFormGroup(sampleWithRequiredData);

        const solution = service.getSolution(formGroup) as any;

        expect(solution).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISolution should not enable id FormControl', () => {
        const formGroup = service.createSolutionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSolution should disable id FormControl', () => {
        const formGroup = service.createSolutionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
