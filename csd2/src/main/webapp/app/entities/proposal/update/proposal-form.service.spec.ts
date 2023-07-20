import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../proposal.test-samples';

import { ProposalFormService } from './proposal-form.service';

describe('Proposal Form Service', () => {
  let service: ProposalFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProposalFormService);
  });

  describe('Service methods', () => {
    describe('createProposalFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProposalFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            creationDate: expect.any(Object),
            proposalState: expect.any(Object),
            user: expect.any(Object),
            risks: expect.any(Object),
            collaboration: expect.any(Object),
            vulnerabilities: expect.any(Object),
          })
        );
      });

      it('passing IProposal should create a new form with FormGroup', () => {
        const formGroup = service.createProposalFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            creationDate: expect.any(Object),
            proposalState: expect.any(Object),
            user: expect.any(Object),
            risks: expect.any(Object),
            collaboration: expect.any(Object),
            vulnerabilities: expect.any(Object),
          })
        );
      });
    });

    describe('getProposal', () => {
      it('should return NewProposal for default Proposal initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createProposalFormGroup(sampleWithNewData);

        const proposal = service.getProposal(formGroup) as any;

        expect(proposal).toMatchObject(sampleWithNewData);
      });

      it('should return NewProposal for empty Proposal initial value', () => {
        const formGroup = service.createProposalFormGroup();

        const proposal = service.getProposal(formGroup) as any;

        expect(proposal).toMatchObject({});
      });

      it('should return IProposal', () => {
        const formGroup = service.createProposalFormGroup(sampleWithRequiredData);

        const proposal = service.getProposal(formGroup) as any;

        expect(proposal).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProposal should not enable id FormControl', () => {
        const formGroup = service.createProposalFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProposal should disable id FormControl', () => {
        const formGroup = service.createProposalFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
