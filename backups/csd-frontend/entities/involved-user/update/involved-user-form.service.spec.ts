import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../involved-user.test-samples';

import { InvolvedUserFormService } from './involved-user-form.service';

describe('InvolvedUser Form Service', () => {
  let service: InvolvedUserFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvolvedUserFormService);
  });

  describe('Service methods', () => {
    describe('createInvolvedUserFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInvolvedUserFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            expertiseLevel: expect.any(Object),
            userRole: expect.any(Object),
            isModerator: expect.any(Object),
            isEligibleDM: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IInvolvedUser should create a new form with FormGroup', () => {
        const formGroup = service.createInvolvedUserFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            expertiseLevel: expect.any(Object),
            userRole: expect.any(Object),
            isModerator: expect.any(Object),
            isEligibleDM: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getInvolvedUser', () => {
      it('should return NewInvolvedUser for default InvolvedUser initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createInvolvedUserFormGroup(sampleWithNewData);

        const involvedUser = service.getInvolvedUser(formGroup) as any;

        expect(involvedUser).toMatchObject(sampleWithNewData);
      });

      it('should return NewInvolvedUser for empty InvolvedUser initial value', () => {
        const formGroup = service.createInvolvedUserFormGroup();

        const involvedUser = service.getInvolvedUser(formGroup) as any;

        expect(involvedUser).toMatchObject({});
      });

      it('should return IInvolvedUser', () => {
        const formGroup = service.createInvolvedUserFormGroup(sampleWithRequiredData);

        const involvedUser = service.getInvolvedUser(formGroup) as any;

        expect(involvedUser).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInvolvedUser should not enable id FormControl', () => {
        const formGroup = service.createInvolvedUserFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInvolvedUser should disable id FormControl', () => {
        const formGroup = service.createInvolvedUserFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
