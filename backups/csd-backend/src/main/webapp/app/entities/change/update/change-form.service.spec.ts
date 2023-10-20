import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../change.test-samples';

import { ChangeFormService } from './change-form.service';

describe('Change Form Service', () => {
  let service: ChangeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeFormService);
  });

  describe('Service methods', () => {
    describe('createChangeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createChangeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            refId: expect.any(Object),
            proposal: expect.any(Object),
          })
        );
      });

      it('passing IChange should create a new form with FormGroup', () => {
        const formGroup = service.createChangeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            refId: expect.any(Object),
            proposal: expect.any(Object),
          })
        );
      });
    });

    describe('getChange', () => {
      it('should return NewChange for default Change initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createChangeFormGroup(sampleWithNewData);

        const change = service.getChange(formGroup) as any;

        expect(change).toMatchObject(sampleWithNewData);
      });

      it('should return NewChange for empty Change initial value', () => {
        const formGroup = service.createChangeFormGroup();

        const change = service.getChange(formGroup) as any;

        expect(change).toMatchObject({});
      });

      it('should return IChange', () => {
        const formGroup = service.createChangeFormGroup(sampleWithRequiredData);

        const change = service.getChange(formGroup) as any;

        expect(change).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IChange should not enable id FormControl', () => {
        const formGroup = service.createChangeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewChange should disable id FormControl', () => {
        const formGroup = service.createChangeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
