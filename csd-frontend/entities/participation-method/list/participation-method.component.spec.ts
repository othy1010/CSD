import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ParticipationMethodService } from '../service/participation-method.service';

import { ParticipationMethodComponent } from './participation-method.component';

describe('ParticipationMethod Management Component', () => {
  let comp: ParticipationMethodComponent;
  let fixture: ComponentFixture<ParticipationMethodComponent>;
  let service: ParticipationMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'participation-method', component: ParticipationMethodComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ParticipationMethodComponent],
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
      .overrideTemplate(ParticipationMethodComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParticipationMethodComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ParticipationMethodService);

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
    expect(comp.participationMethods?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to participationMethodService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getParticipationMethodIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getParticipationMethodIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
