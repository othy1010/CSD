import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../collaboration.test-samples';

import { CollaborationFormService } from './collaboration-form.service';

describe('Collaboration Form Service', () => {
  let service: CollaborationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollaborationFormService);
  });

  describe('Service methods', () => {
    describe('createCollaborationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCollaborationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            startDate: expect.any(Object),
            decisionDuration: expect.any(Object),
            evaluationDuration: expect.any(Object),
            collaborationState: expect.any(Object),
            decisionPattern: expect.any(Object),
          })
        );
      });

      it('passing ICollaboration should create a new form with FormGroup', () => {
        const formGroup = service.createCollaborationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            startDate: expect.any(Object),
            decisionDuration: expect.any(Object),
            evaluationDuration: expect.any(Object),
            collaborationState: expect.any(Object),
            decisionPattern: expect.any(Object),
          })
        );
      });
    });

    describe('getCollaboration', () => {
      it('should return NewCollaboration for default Collaboration initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCollaborationFormGroup(sampleWithNewData);

        const collaboration = service.getCollaboration(formGroup) as any;

        expect(collaboration).toMatchObject(sampleWithNewData);
      });

      it('should return NewCollaboration for empty Collaboration initial value', () => {
        const formGroup = service.createCollaborationFormGroup();

        const collaboration = service.getCollaboration(formGroup) as any;

        expect(collaboration).toMatchObject({});
      });

      it('should return ICollaboration', () => {
        const formGroup = service.createCollaborationFormGroup(sampleWithRequiredData);

        const collaboration = service.getCollaboration(formGroup) as any;

        expect(collaboration).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICollaboration should not enable id FormControl', () => {
        const formGroup = service.createCollaborationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCollaboration should disable id FormControl', () => {
        const formGroup = service.createCollaborationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
