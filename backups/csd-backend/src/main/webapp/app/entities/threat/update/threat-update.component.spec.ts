import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ThreatFormService } from './threat-form.service';
import { ThreatService } from '../service/threat.service';
import { IThreat } from '../threat.model';
import { IVulnerability } from 'app/entities/vulnerability/vulnerability.model';
import { VulnerabilityService } from 'app/entities/vulnerability/service/vulnerability.service';

import { ThreatUpdateComponent } from './threat-update.component';

describe('Threat Management Update Component', () => {
  let comp: ThreatUpdateComponent;
  let fixture: ComponentFixture<ThreatUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let threatFormService: ThreatFormService;
  let threatService: ThreatService;
  let vulnerabilityService: VulnerabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ThreatUpdateComponent],
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
      .overrideTemplate(ThreatUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ThreatUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    threatFormService = TestBed.inject(ThreatFormService);
    threatService = TestBed.inject(ThreatService);
    vulnerabilityService = TestBed.inject(VulnerabilityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Vulnerability query and add missing value', () => {
      const threat: IThreat = { id: 456 };
      const vulnerabilities: IVulnerability[] = [{ id: 83609 }];
      threat.vulnerabilities = vulnerabilities;

      const vulnerabilityCollection: IVulnerability[] = [{ id: 52798 }];
      jest.spyOn(vulnerabilityService, 'query').mockReturnValue(of(new HttpResponse({ body: vulnerabilityCollection })));
      const additionalVulnerabilities = [...vulnerabilities];
      const expectedCollection: IVulnerability[] = [...additionalVulnerabilities, ...vulnerabilityCollection];
      jest.spyOn(vulnerabilityService, 'addVulnerabilityToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ threat });
      comp.ngOnInit();

      expect(vulnerabilityService.query).toHaveBeenCalled();
      expect(vulnerabilityService.addVulnerabilityToCollectionIfMissing).toHaveBeenCalledWith(
        vulnerabilityCollection,
        ...additionalVulnerabilities.map(expect.objectContaining)
      );
      expect(comp.vulnerabilitiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const threat: IThreat = { id: 456 };
      const vulnerability: IVulnerability = { id: 54228 };
      threat.vulnerabilities = [vulnerability];

      activatedRoute.data = of({ threat });
      comp.ngOnInit();

      expect(comp.vulnerabilitiesSharedCollection).toContain(vulnerability);
      expect(comp.threat).toEqual(threat);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IThreat>>();
      const threat = { id: 123 };
      jest.spyOn(threatFormService, 'getThreat').mockReturnValue(threat);
      jest.spyOn(threatService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ threat });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: threat }));
      saveSubject.complete();

      // THEN
      expect(threatFormService.getThreat).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(threatService.update).toHaveBeenCalledWith(expect.objectContaining(threat));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IThreat>>();
      const threat = { id: 123 };
      jest.spyOn(threatFormService, 'getThreat').mockReturnValue({ id: null });
      jest.spyOn(threatService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ threat: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: threat }));
      saveSubject.complete();

      // THEN
      expect(threatFormService.getThreat).toHaveBeenCalled();
      expect(threatService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IThreat>>();
      const threat = { id: 123 };
      jest.spyOn(threatService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ threat });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(threatService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareVulnerability', () => {
      it('Should forward to vulnerabilityService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(vulnerabilityService, 'compareVulnerability');
        comp.compareVulnerability(entity, entity2);
        expect(vulnerabilityService.compareVulnerability).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
