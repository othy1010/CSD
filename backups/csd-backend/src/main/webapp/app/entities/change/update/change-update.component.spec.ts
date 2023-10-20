import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChangeFormService } from './change-form.service';
import { ChangeService } from '../service/change.service';
import { IChange } from '../change.model';
import { IProposal } from 'app/entities/proposal/proposal.model';
import { ProposalService } from 'app/entities/proposal/service/proposal.service';

import { ChangeUpdateComponent } from './change-update.component';

describe('Change Management Update Component', () => {
  let comp: ChangeUpdateComponent;
  let fixture: ComponentFixture<ChangeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let changeFormService: ChangeFormService;
  let changeService: ChangeService;
  let proposalService: ProposalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ChangeUpdateComponent],
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
      .overrideTemplate(ChangeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChangeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    changeFormService = TestBed.inject(ChangeFormService);
    changeService = TestBed.inject(ChangeService);
    proposalService = TestBed.inject(ProposalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Proposal query and add missing value', () => {
      const change: IChange = { id: 456 };
      const proposal: IProposal = { id: 7559 };
      change.proposal = proposal;

      const proposalCollection: IProposal[] = [{ id: 14218 }];
      jest.spyOn(proposalService, 'query').mockReturnValue(of(new HttpResponse({ body: proposalCollection })));
      const additionalProposals = [proposal];
      const expectedCollection: IProposal[] = [...additionalProposals, ...proposalCollection];
      jest.spyOn(proposalService, 'addProposalToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ change });
      comp.ngOnInit();

      expect(proposalService.query).toHaveBeenCalled();
      expect(proposalService.addProposalToCollectionIfMissing).toHaveBeenCalledWith(
        proposalCollection,
        ...additionalProposals.map(expect.objectContaining)
      );
      expect(comp.proposalsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const change: IChange = { id: 456 };
      const proposal: IProposal = { id: 69799 };
      change.proposal = proposal;

      activatedRoute.data = of({ change });
      comp.ngOnInit();

      expect(comp.proposalsSharedCollection).toContain(proposal);
      expect(comp.change).toEqual(change);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChange>>();
      const change = { id: 123 };
      jest.spyOn(changeFormService, 'getChange').mockReturnValue(change);
      jest.spyOn(changeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ change });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: change }));
      saveSubject.complete();

      // THEN
      expect(changeFormService.getChange).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(changeService.update).toHaveBeenCalledWith(expect.objectContaining(change));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChange>>();
      const change = { id: 123 };
      jest.spyOn(changeFormService, 'getChange').mockReturnValue({ id: null });
      jest.spyOn(changeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ change: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: change }));
      saveSubject.complete();

      // THEN
      expect(changeFormService.getChange).toHaveBeenCalled();
      expect(changeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChange>>();
      const change = { id: 123 };
      jest.spyOn(changeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ change });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(changeService.update).toHaveBeenCalled();
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
  });
});
