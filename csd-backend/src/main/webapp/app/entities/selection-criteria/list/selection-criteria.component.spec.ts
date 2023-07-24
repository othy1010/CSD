import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SelectionCriteriaService } from '../service/selection-criteria.service';

import { SelectionCriteriaComponent } from './selection-criteria.component';

describe('SelectionCriteria Management Component', () => {
  let comp: SelectionCriteriaComponent;
  let fixture: ComponentFixture<SelectionCriteriaComponent>;
  let service: SelectionCriteriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'selection-criteria', component: SelectionCriteriaComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [SelectionCriteriaComponent],
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
      .overrideTemplate(SelectionCriteriaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SelectionCriteriaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SelectionCriteriaService);

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
    expect(comp.selectionCriteria?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to selectionCriteriaService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSelectionCriteriaIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSelectionCriteriaIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
