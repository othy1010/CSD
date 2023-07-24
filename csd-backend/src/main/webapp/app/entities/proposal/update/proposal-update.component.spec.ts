import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProposalFormService } from './proposal-form.service';
import { ProposalService } from '../service/proposal.service';
import { IProposal } from '../proposal.model';
import { IInvolvedUser } from 'app/entities/involved-user/involved-user.model';
import { InvolvedUserService } from 'app/entities/involved-user/service/involved-user.service';
import { IRisk } from 'app/entities/risk/risk.model';
import { RiskService } from 'app/entities/risk/service/risk.service';
import { ICollaboration } from 'app/entities/collaboration/collaboration.model';
import { CollaborationService } from 'app/entities/collaboration/service/collaboration.service';

import { ProposalUpdateComponent } from './proposal-update.component';

describe('Proposal Management Update Component', () => {
  let comp: ProposalUpdateComponent;
  let fixture: ComponentFixture<ProposalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let proposalFormService: ProposalFormService;
  let proposalService: ProposalService;
  let involvedUserService: InvolvedUserService;
  let riskService: RiskService;
  let collaborationService: CollaborationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProposalUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ProposalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProposalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    proposalFormService = TestBed.inject(ProposalFormService);
    proposalService = TestBed.inject(ProposalService);
    involvedUserService = TestBed.inject(InvolvedUserService);
    riskService = TestBed.inject(RiskService);
    collaborationService = TestBed.inject(CollaborationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call InvolvedUser query and add missing value', () => {
      const proposal: IProposal = { id: 456 };
      const user: IInvolvedUser = { id: 94720 };
      proposal.user = user;

      const involvedUserCollection: IInvolvedUser[] = [{ id: 90295 }];
      jest.spyOn(involvedUserService, 'query').mockReturnValue(of(new HttpResponse({ body: involvedUserCollection })));
      const additionalInvolvedUsers = [user];
      const expectedCollection: IInvolvedUser[] = [...additionalInvolvedUsers, ...involvedUserCollection];
      jest.spyOn(involvedUserService, 'addInvolvedUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ proposal });
      comp.ngOnInit();

      expect(involvedUserService.query).toHaveBeenCalled();
      expect(involvedUserService.addInvolvedUserToCollectionIfMissing).toHaveBeenCalledWith(
        involvedUserCollection,
        ...additionalInvolvedUsers.map(expect.objectContaining)
      );
      expect(comp.involvedUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Risk query and add missing value', () => {
      const proposal: IProposal = { id: 456 };
      const risks: IRisk[] = [{ id: 97840 }];
      proposal.risks = risks;

      const riskCollection: IRisk[] = [{ id: 27791 }];
      jest.spyOn(riskService, 'query').mockReturnValue(of(new HttpResponse({ body: riskCollection })));
      const additionalRisks = [...risks];
      const expectedCollection: IRisk[] = [...additionalRisks, ...riskCollection];
      jest.spyOn(riskService, 'addRiskToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ proposal });
      comp.ngOnInit();

      expect(riskService.query).toHaveBeenCalled();
      expect(riskService.addRiskToCollectionIfMissing).toHaveBeenCalledWith(
        riskCollection,
        ...additionalRisks.map(expect.objectContaining)
      );
      expect(comp.risksSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Collaboration query and add missing value', () => {
      const proposal: IProposal = { id: 456 };
      const collaboration: ICollaboration = { id: 74991 };
      proposal.collaboration = collaboration;

      const collaborationCollection: ICollaboration[] = [{ id: 72152 }];
      jest.spyOn(collaborationService, 'query').mockReturnValue(of(new HttpResponse({ body: collaborationCollection })));
      const additionalCollaborations = [collaboration];
      const expectedCollection: ICollaboration[] = [...additionalCollaborations, ...collaborationCollection];
      jest.spyOn(collaborationService, 'addCollaborationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ proposal });
      comp.ngOnInit();

      expect(collaborationService.query).toHaveBeenCalled();
      expect(collaborationService.addCollaborationToCollectionIfMissing).toHaveBeenCalledWith(
        collaborationCollection,
        ...additionalCollaborations.map(expect.objectContaining)
      );
      expect(comp.collaborationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const proposal: IProposal = { id: 456 };
      const user: IInvolvedUser = { id: 717 };
      proposal.user = user;
      const risk: IRisk = { id: 83254 };
      proposal.risks = [risk];
      const collaboration: ICollaboration = { id: 62027 };
      proposal.collaboration = collaboration;

      activatedRoute.data = of({ proposal });
      comp.ngOnInit();

      expect(comp.involvedUsersSharedCollection).toContain(user);
      expect(comp.risksSharedCollection).toContain(risk);
      expect(comp.collaborationsSharedCollection).toContain(collaboration);
      expect(comp.proposal).toEqual(proposal);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProposal>>();
      const proposal = { id: 123 };
      jest.spyOn(proposalFormService, 'getProposal').mockReturnValue(proposal);
      jest.spyOn(proposalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ proposal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: proposal }));
      saveSubject.complete();

      // THEN
      expect(proposalFormService.getProposal).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(proposalService.update).toHaveBeenCalledWith(expect.objectContaining(proposal));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProposal>>();
      const proposal = { id: 123 };
      jest.spyOn(proposalFormService, 'getProposal').mockReturnValue({ id: null });
      jest.spyOn(proposalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ proposal: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: proposal }));
      saveSubject.complete();

      // THEN
      expect(proposalFormService.getProposal).toHaveBeenCalled();
      expect(proposalService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProposal>>();
      const proposal = { id: 123 };
      jest.spyOn(proposalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ proposal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(proposalService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareInvolvedUser', () => {
      it('Should forward to involvedUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(involvedUserService, 'compareInvolvedUser');
        comp.compareInvolvedUser(entity, entity2);
        expect(involvedUserService.compareInvolvedUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareRisk', () => {
      it('Should forward to riskService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(riskService, 'compareRisk');
        comp.compareRisk(entity, entity2);
        expect(riskService.compareRisk).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCollaboration', () => {
      it('Should forward to collaborationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(collaborationService, 'compareCollaboration');
        comp.compareCollaboration(entity, entity2);
        expect(collaborationService.compareCollaboration).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
