import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MitigationFormService } from './mitigation-form.service';
import { MitigationService } from '../service/mitigation.service';
import { IMitigation } from '../mitigation.model';
import { IVulnerability } from 'app/entities/vulnerability/vulnerability.model';
import { VulnerabilityService } from 'app/entities/vulnerability/service/vulnerability.service';

import { MitigationUpdateComponent } from './mitigation-update.component';

describe('Mitigation Management Update Component', () => {
  let comp: MitigationUpdateComponent;
  let fixture: ComponentFixture<MitigationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mitigationFormService: MitigationFormService;
  let mitigationService: MitigationService;
  let vulnerabilityService: VulnerabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MitigationUpdateComponent],
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
      .overrideTemplate(MitigationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MitigationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mitigationFormService = TestBed.inject(MitigationFormService);
    mitigationService = TestBed.inject(MitigationService);
    vulnerabilityService = TestBed.inject(VulnerabilityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Vulnerability query and add missing value', () => {
      const mitigation: IMitigation = { id: 456 };
      const vulnerabilities: IVulnerability[] = [{ id: 25086 }];
      mitigation.vulnerabilities = vulnerabilities;

      const vulnerabilityCollection: IVulnerability[] = [{ id: 81354 }];
      jest.spyOn(vulnerabilityService, 'query').mockReturnValue(of(new HttpResponse({ body: vulnerabilityCollection })));
      const additionalVulnerabilities = [...vulnerabilities];
      const expectedCollection: IVulnerability[] = [...additionalVulnerabilities, ...vulnerabilityCollection];
      jest.spyOn(vulnerabilityService, 'addVulnerabilityToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mitigation });
      comp.ngOnInit();

      expect(vulnerabilityService.query).toHaveBeenCalled();
      expect(vulnerabilityService.addVulnerabilityToCollectionIfMissing).toHaveBeenCalledWith(
        vulnerabilityCollection,
        ...additionalVulnerabilities.map(expect.objectContaining)
      );
      expect(comp.vulnerabilitiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const mitigation: IMitigation = { id: 456 };
      const vulnerability: IVulnerability = { id: 57361 };
      mitigation.vulnerabilities = [vulnerability];

      activatedRoute.data = of({ mitigation });
      comp.ngOnInit();

      expect(comp.vulnerabilitiesSharedCollection).toContain(vulnerability);
      expect(comp.mitigation).toEqual(mitigation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMitigation>>();
      const mitigation = { id: 123 };
      jest.spyOn(mitigationFormService, 'getMitigation').mockReturnValue(mitigation);
      jest.spyOn(mitigationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mitigation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mitigation }));
      saveSubject.complete();

      // THEN
      expect(mitigationFormService.getMitigation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(mitigationService.update).toHaveBeenCalledWith(expect.objectContaining(mitigation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMitigation>>();
      const mitigation = { id: 123 };
      jest.spyOn(mitigationFormService, 'getMitigation').mockReturnValue({ id: null });
      jest.spyOn(mitigationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mitigation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mitigation }));
      saveSubject.complete();

      // THEN
      expect(mitigationFormService.getMitigation).toHaveBeenCalled();
      expect(mitigationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMitigation>>();
      const mitigation = { id: 123 };
      jest.spyOn(mitigationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mitigation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mitigationService.update).toHaveBeenCalled();
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
