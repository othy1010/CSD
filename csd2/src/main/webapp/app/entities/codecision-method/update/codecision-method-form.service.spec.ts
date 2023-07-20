import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../codecision-method.test-samples';

import { CodecisionMethodFormService } from './codecision-method-form.service';

describe('CodecisionMethod Form Service', () => {
  let service: CodecisionMethodFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodecisionMethodFormService);
  });

  describe('Service methods', () => {
    describe('createCodecisionMethodFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCodecisionMethodFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            processKind: expect.any(Object),
            evaluationKind: expect.any(Object),
            agreementThreshold: expect.any(Object),
          })
        );
      });

      it('passing ICodecisionMethod should create a new form with FormGroup', () => {
        const formGroup = service.createCodecisionMethodFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            processKind: expect.any(Object),
            evaluationKind: expect.any(Object),
            agreementThreshold: expect.any(Object),
          })
        );
      });
    });

    describe('getCodecisionMethod', () => {
      it('should return NewCodecisionMethod for default CodecisionMethod initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCodecisionMethodFormGroup(sampleWithNewData);

        const codecisionMethod = service.getCodecisionMethod(formGroup) as any;

        expect(codecisionMethod).toMatchObject(sampleWithNewData);
      });

      it('should return NewCodecisionMethod for empty CodecisionMethod initial value', () => {
        const formGroup = service.createCodecisionMethodFormGroup();

        const codecisionMethod = service.getCodecisionMethod(formGroup) as any;

        expect(codecisionMethod).toMatchObject({});
      });

      it('should return ICodecisionMethod', () => {
        const formGroup = service.createCodecisionMethodFormGroup(sampleWithRequiredData);

        const codecisionMethod = service.getCodecisionMethod(formGroup) as any;

        expect(codecisionMethod).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICodecisionMethod should not enable id FormControl', () => {
        const formGroup = service.createCodecisionMethodFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCodecisionMethod should disable id FormControl', () => {
        const formGroup = service.createCodecisionMethodFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
