import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../decision-pattern.test-samples';

import { DecisionPatternFormService } from './decision-pattern-form.service';

describe('DecisionPattern Form Service', () => {
  let service: DecisionPatternFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecisionPatternFormService);
  });

  describe('Service methods', () => {
    describe('createDecisionPatternFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDecisionPatternFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            participationMethod: expect.any(Object),
            codecisionMethod: expect.any(Object),
            intent: expect.any(Object),
            solution: expect.any(Object),
            application: expect.any(Object),
            knowuse: expect.any(Object),
          })
        );
      });

      it('passing IDecisionPattern should create a new form with FormGroup', () => {
        const formGroup = service.createDecisionPatternFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            participationMethod: expect.any(Object),
            codecisionMethod: expect.any(Object),
            intent: expect.any(Object),
            solution: expect.any(Object),
            application: expect.any(Object),
            knowuse: expect.any(Object),
          })
        );
      });
    });

    describe('getDecisionPattern', () => {
      it('should return NewDecisionPattern for default DecisionPattern initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDecisionPatternFormGroup(sampleWithNewData);

        const decisionPattern = service.getDecisionPattern(formGroup) as any;

        expect(decisionPattern).toMatchObject(sampleWithNewData);
      });

      it('should return NewDecisionPattern for empty DecisionPattern initial value', () => {
        const formGroup = service.createDecisionPatternFormGroup();

        const decisionPattern = service.getDecisionPattern(formGroup) as any;

        expect(decisionPattern).toMatchObject({});
      });

      it('should return IDecisionPattern', () => {
        const formGroup = service.createDecisionPatternFormGroup(sampleWithRequiredData);

        const decisionPattern = service.getDecisionPattern(formGroup) as any;

        expect(decisionPattern).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDecisionPattern should not enable id FormControl', () => {
        const formGroup = service.createDecisionPatternFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDecisionPattern should disable id FormControl', () => {
        const formGroup = service.createDecisionPatternFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
