import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ThreatService } from '../service/threat.service';

import { ThreatComponent } from './threat.component';

describe('Threat Management Component', () => {
  let comp: ThreatComponent;
  let fixture: ComponentFixture<ThreatComponent>;
  let service: ThreatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'threat', component: ThreatComponent }]), HttpClientTestingModule],
      declarations: [ThreatComponent],
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
      .overrideTemplate(ThreatComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ThreatComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ThreatService);

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
    expect(comp.threats?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to threatService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getThreatIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getThreatIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
