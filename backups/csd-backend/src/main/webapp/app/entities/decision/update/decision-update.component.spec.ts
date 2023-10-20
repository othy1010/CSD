import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DecisionFormService } from './decision-form.service';
import { DecisionService } from '../service/decision.service';
import { IDecision } from '../decision.model';
import { IProposal } from 'app/entities/proposal/proposal.model';
import { ProposalService } from 'app/entities/proposal/service/proposal.service';
import { IInvolvedUser } from 'app/entities/involved-user/involved-user.model';
import { InvolvedUserService } from 'app/entities/involved-user/service/involved-user.service';

import { DecisionUpdateComponent } from './decision-update.component';

describe('Decision Management Update Component', () => {
  let comp: DecisionUpdateComponent;
  let fixture: ComponentFixture<DecisionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let decisionFormService: DecisionFormService;
  let decisionService: DecisionService;
  let proposalService: ProposalService;
  let involvedUserService: InvolvedUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DecisionUpdateComponent],
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
      .overrideTemplate(DecisionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DecisionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    decisionFormService = TestBed.inject(DecisionFormService);
    decisionService = TestBed.inject(DecisionService);
    proposalService = TestBed.inject(ProposalService);
    involvedUserService = TestBed.inject(InvolvedUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Proposal query and add missing value', () => {
      const decision: IDecision = { id: 456 };
      const proposal: IProposal = { id: 25064 };
      decision.proposal = proposal;

      const proposalCollection: IProposal[] = [{ id: 53186 }];
      jest.spyOn(proposalService, 'query').mockReturnValue(of(new HttpResponse({ body: proposalCollection })));
      const additionalProposals = [proposal];
      const expectedCollection: IProposal[] = [...additionalProposals, ...proposalCollection];
      jest.spyOn(proposalService, 'addProposalToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ decision });
      comp.ngOnInit();

      expect(proposalService.query).toHaveBeenCalled();
      expect(proposalService.addProposalToCollectionIfMissing).toHaveBeenCalledWith(
        proposalCollection,
        ...additionalProposals.map(expect.objectContaining)
      );
      expect(comp.proposalsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call InvolvedUser query and add missing value', () => {
      const decision: IDecision = { id: 456 };
      const user: IInvolvedUser = { id: 59003 };
      decision.user = user;

      const involvedUserCollection: IInvolvedUser[] = [{ id: 31509 }];
      jest.spyOn(involvedUserService, 'query').mockReturnValue(of(new HttpResponse({ body: involvedUserCollection })));
      const additionalInvolvedUsers = [user];
      const expectedCollection: IInvolvedUser[] = [...additionalInvolvedUsers, ...involvedUserCollection];
      jest.spyOn(involvedUserService, 'addInvolvedUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ decision });
      comp.ngOnInit();

      expect(involvedUserService.query).toHaveBeenCalled();
      expect(involvedUserService.addInvolvedUserToCollectionIfMissing).toHaveBeenCalledWith(
        involvedUserCollection,
        ...additionalInvolvedUsers.map(expect.objectContaining)
      );
      expect(comp.involvedUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const decision: IDecision = { id: 456 };
      const proposal: IProposal = { id: 48291 };
      decision.proposal = proposal;
      const user: IInvolvedUser = { id: 38317 };
      decision.user = user;

      activatedRoute.data = of({ decision });
      comp.ngOnInit();

      expect(comp.proposalsSharedCollection).toContain(proposal);
      expect(comp.involvedUsersSharedCollection).toContain(user);
      expect(comp.decision).toEqual(decision);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecision>>();
      const decision = { id: 123 };
      jest.spyOn(decisionFormService, 'getDecision').mockReturnValue(decision);
      jest.spyOn(decisionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decision });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: decision }));
      saveSubject.complete();

      // THEN
      expect(decisionFormService.getDecision).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(decisionService.update).toHaveBeenCalledWith(expect.objectContaining(decision));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecision>>();
      const decision = { id: 123 };
      jest.spyOn(decisionFormService, 'getDecision').mockReturnValue({ id: null });
      jest.spyOn(decisionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decision: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: decision }));
      saveSubject.complete();

      // THEN
      expect(decisionFormService.getDecision).toHaveBeenCalled();
      expect(decisionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecision>>();
      const decision = { id: 123 };
      jest.spyOn(decisionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decision });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(decisionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProposal', () => {
      it('Should forward to proposalService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(proposalService, 'compareProposal');
        comp.compareProposal(entity, entity2);
        expect(proposalService.compareProposal).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareInvolvedUser', () => {
      it('Should forward to involvedUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(involvedUserService, 'compareInvolvedUser');
        comp.compareInvolvedUser(entity, entity2);
        expect(involvedUserService.compareInvolvedUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
