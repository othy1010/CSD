import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mitigation.test-samples';

import { MitigationFormService } from './mitigation-form.service';

describe('Mitigation Form Service', () => {
  let service: MitigationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MitigationFormService);
  });

  describe('Service methods', () => {
    describe('createMitigationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMitigationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            vulnerabilities: expect.any(Object),
          })
        );
      });

      it('passing IMitigation should create a new form with FormGroup', () => {
        const formGroup = service.createMitigationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            vulnerabilities: expect.any(Object),
          })
        );
      });
    });

    describe('getMitigation', () => {
      it('should return NewMitigation for default Mitigation initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMitigationFormGroup(sampleWithNewData);

        const mitigation = service.getMitigation(formGroup) as any;

        expect(mitigation).toMatchObject(sampleWithNewData);
      });

      it('should return NewMitigation for empty Mitigation initial value', () => {
        const formGroup = service.createMitigationFormGroup();

        const mitigation = service.getMitigation(formGroup) as any;

        expect(mitigation).toMatchObject({});
      });

      it('should return IMitigation', () => {
        const formGroup = service.createMitigationFormGroup(sampleWithRequiredData);

        const mitigation = service.getMitigation(formGroup) as any;

        expect(mitigation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMitigation should not enable id FormControl', () => {
        const formGroup = service.createMitigationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMitigation should disable id FormControl', () => {
        const formGroup = service.createMitigationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
