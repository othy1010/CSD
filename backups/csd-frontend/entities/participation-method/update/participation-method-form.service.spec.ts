import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../participation-method.test-samples';

import { ParticipationMethodFormService } from './participation-method-form.service';

describe('ParticipationMethod Form Service', () => {
  let service: ParticipationMethodFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipationMethodFormService);
  });

  describe('Service methods', () => {
    describe('createParticipationMethodFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createParticipationMethodFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
          })
        );
      });

      it('passing IParticipationMethod should create a new form with FormGroup', () => {
        const formGroup = service.createParticipationMethodFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
          })
        );
      });
    });

    describe('getParticipationMethod', () => {
      it('should return NewParticipationMethod for default ParticipationMethod initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createParticipationMethodFormGroup(sampleWithNewData);

        const participationMethod = service.getParticipationMethod(formGroup) as any;

        expect(participationMethod).toMatchObject(sampleWithNewData);
      });

      it('should return NewParticipationMethod for empty ParticipationMethod initial value', () => {
        const formGroup = service.createParticipationMethodFormGroup();

        const participationMethod = service.getParticipationMethod(formGroup) as any;

        expect(participationMethod).toMatchObject({});
      });

      it('should return IParticipationMethod', () => {
        const formGroup = service.createParticipationMethodFormGroup(sampleWithRequiredData);

        const participationMethod = service.getParticipationMethod(formGroup) as any;

        expect(participationMethod).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IParticipationMethod should not enable id FormControl', () => {
        const formGroup = service.createParticipationMethodFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewParticipationMethod should disable id FormControl', () => {
        const formGroup = service.createParticipationMethodFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
