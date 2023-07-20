import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../decision.test-samples';

import { DecisionFormService } from './decision-form.service';

describe('Decision Form Service', () => {
  let service: DecisionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecisionFormService);
  });

  describe('Service methods', () => {
    describe('createDecisionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDecisionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            agreement: expect.any(Object),
            comment: expect.any(Object),
            proposal: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IDecision should create a new form with FormGroup', () => {
        const formGroup = service.createDecisionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            agreement: expect.any(Object),
            comment: expect.any(Object),
            proposal: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getDecision', () => {
      it('should return NewDecision for default Decision initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDecisionFormGroup(sampleWithNewData);

        const decision = service.getDecision(formGroup) as any;

        expect(decision).toMatchObject(sampleWithNewData);
      });

      it('should return NewDecision for empty Decision initial value', () => {
        const formGroup = service.createDecisionFormGroup();

        const decision = service.getDecision(formGroup) as any;

        expect(decision).toMatchObject({});
      });

      it('should return IDecision', () => {
        const formGroup = service.createDecisionFormGroup(sampleWithRequiredData);

        const decision = service.getDecision(formGroup) as any;

        expect(decision).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDecision should not enable id FormControl', () => {
        const formGroup = service.createDecisionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDecision should disable id FormControl', () => {
        const formGroup = service.createDecisionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
