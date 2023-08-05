import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../threat.test-samples';

import { ThreatFormService } from './threat-form.service';

describe('Threat Form Service', () => {
  let service: ThreatFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreatFormService);
  });

  describe('Service methods', () => {
    describe('createThreatFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createThreatFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            probability: expect.any(Object),
            reference: expect.any(Object),
            refId: expect.any(Object),
            vulnerabilities: expect.any(Object),
          })
        );
      });

      it('passing IThreat should create a new form with FormGroup', () => {
        const formGroup = service.createThreatFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            probability: expect.any(Object),
            reference: expect.any(Object),
            refId: expect.any(Object),
            vulnerabilities: expect.any(Object),
          })
        );
      });
    });

    describe('getThreat', () => {
      it('should return NewThreat for default Threat initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createThreatFormGroup(sampleWithNewData);

        const threat = service.getThreat(formGroup) as any;

        expect(threat).toMatchObject(sampleWithNewData);
      });

      it('should return NewThreat for empty Threat initial value', () => {
        const formGroup = service.createThreatFormGroup();

        const threat = service.getThreat(formGroup) as any;

        expect(threat).toMatchObject({});
      });

      it('should return IThreat', () => {
        const formGroup = service.createThreatFormGroup(sampleWithRequiredData);

        const threat = service.getThreat(formGroup) as any;

        expect(threat).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IThreat should not enable id FormControl', () => {
        const formGroup = service.createThreatFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewThreat should disable id FormControl', () => {
        const formGroup = service.createThreatFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
