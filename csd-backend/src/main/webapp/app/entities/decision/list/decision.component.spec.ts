import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DecisionService } from '../service/decision.service';

import { DecisionComponent } from './decision.component';

describe('Decision Management Component', () => {
  let comp: DecisionComponent;
  let fixture: ComponentFixture<DecisionComponent>;
  let service: DecisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'decision', component: DecisionComponent }]), HttpClientTestingModule],
      declarations: [DecisionComponent],
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
      .overrideTemplate(DecisionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DecisionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DecisionService);

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
    expect(comp.decisions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to decisionService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDecisionIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDecisionIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
