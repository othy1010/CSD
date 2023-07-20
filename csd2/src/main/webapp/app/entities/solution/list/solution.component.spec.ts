import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SolutionService } from '../service/solution.service';

import { SolutionComponent } from './solution.component';

describe('Solution Management Component', () => {
  let comp: SolutionComponent;
  let fixture: ComponentFixture<SolutionComponent>;
  let service: SolutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'solution', component: SolutionComponent }]), HttpClientTestingModule],
      declarations: [SolutionComponent],
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
      .overrideTemplate(SolutionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SolutionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SolutionService);

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
    expect(comp.solutions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to solutionService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSolutionIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSolutionIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
