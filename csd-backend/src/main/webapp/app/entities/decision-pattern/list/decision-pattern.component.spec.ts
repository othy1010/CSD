import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DecisionPatternService } from '../service/decision-pattern.service';

import { DecisionPatternComponent } from './decision-pattern.component';

describe('DecisionPattern Management Component', () => {
  let comp: DecisionPatternComponent;
  let fixture: ComponentFixture<DecisionPatternComponent>;
  let service: DecisionPatternService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'decision-pattern', component: DecisionPatternComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [DecisionPatternComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(DecisionPatternComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DecisionPatternComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DecisionPatternService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.decisionPatterns?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to decisionPatternService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDecisionPatternIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDecisionPatternIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
