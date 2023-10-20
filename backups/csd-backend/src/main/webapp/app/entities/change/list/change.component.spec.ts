import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ChangeService } from '../service/change.service';

import { ChangeComponent } from './change.component';

describe('Change Management Component', () => {
  let comp: ChangeComponent;
  let fixture: ComponentFixture<ChangeComponent>;
  let service: ChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'change', component: ChangeComponent }]), HttpClientTestingModule],
      declarations: [ChangeComponent],
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
      .overrideTemplate(ChangeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChangeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ChangeService);

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
    expect(comp.changes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to changeService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getChangeIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getChangeIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
