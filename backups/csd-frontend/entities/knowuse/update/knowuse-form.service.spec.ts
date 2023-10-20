import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../knowuse.test-samples';

import { KnowuseFormService } from './knowuse-form.service';

describe('Knowuse Form Service', () => {
  let service: KnowuseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KnowuseFormService);
  });

  describe('Service methods', () => {
    describe('createKnowuseFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createKnowuseFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });

      it('passing IKnowuse should create a new form with FormGroup', () => {
        const formGroup = service.createKnowuseFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });
    });

    describe('getKnowuse', () => {
      it('should return NewKnowuse for default Knowuse initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createKnowuseFormGroup(sampleWithNewData);

        const knowuse = service.getKnowuse(formGroup) as any;

        expect(knowuse).toMatchObject(sampleWithNewData);
      });

      it('should return NewKnowuse for empty Knowuse initial value', () => {
        const formGroup = service.createKnowuseFormGroup();

        const knowuse = service.getKnowuse(formGroup) as any;

        expect(knowuse).toMatchObject({});
      });

      it('should return IKnowuse', () => {
        const formGroup = service.createKnowuseFormGroup(sampleWithRequiredData);

        const knowuse = service.getKnowuse(formGroup) as any;

        expect(knowuse).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IKnowuse should not enable id FormControl', () => {
        const formGroup = service.createKnowuseFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewKnowuse should disable id FormControl', () => {
        const formGroup = service.createKnowuseFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
