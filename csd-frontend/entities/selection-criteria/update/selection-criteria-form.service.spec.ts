import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../selection-criteria.test-samples';

import { SelectionCriteriaFormService } from './selection-criteria-form.service';

describe('SelectionCriteria Form Service', () => {
  let service: SelectionCriteriaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectionCriteriaFormService);
  });

  describe('Service methods', () => {
    describe('createSelectionCriteriaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSelectionCriteriaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            criterion: expect.any(Object),
            participationMethod: expect.any(Object),
          })
        );
      });

      it('passing ISelectionCriteria should create a new form with FormGroup', () => {
        const formGroup = service.createSelectionCriteriaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            criterion: expect.any(Object),
            participationMethod: expect.any(Object),
          })
        );
      });
    });

    describe('getSelectionCriteria', () => {
      it('should return NewSelectionCriteria for default SelectionCriteria initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSelectionCriteriaFormGroup(sampleWithNewData);

        const selectionCriteria = service.getSelectionCriteria(formGroup) as any;

        expect(selectionCriteria).toMatchObject(sampleWithNewData);
      });

      it('should return NewSelectionCriteria for empty SelectionCriteria initial value', () => {
        const formGroup = service.createSelectionCriteriaFormGroup();

        const selectionCriteria = service.getSelectionCriteria(formGroup) as any;

        expect(selectionCriteria).toMatchObject({});
      });

      it('should return ISelectionCriteria', () => {
        const formGroup = service.createSelectionCriteriaFormGroup(sampleWithRequiredData);

        const selectionCriteria = service.getSelectionCriteria(formGroup) as any;

        expect(selectionCriteria).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISelectionCriteria should not enable id FormControl', () => {
        const formGroup = service.createSelectionCriteriaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSelectionCriteria should disable id FormControl', () => {
        const formGroup = service.createSelectionCriteriaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
