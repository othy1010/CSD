import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { KnowuseService } from '../service/knowuse.service';

import { KnowuseComponent } from './knowuse.component';

describe('Knowuse Management Component', () => {
  let comp: KnowuseComponent;
  let fixture: ComponentFixture<KnowuseComponent>;
  let service: KnowuseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'knowuse', component: KnowuseComponent }]), HttpClientTestingModule],
      declarations: [KnowuseComponent],
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
      .overrideTemplate(KnowuseComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KnowuseComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(KnowuseService);

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
    expect(comp.knowuses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to knowuseService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getKnowuseIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getKnowuseIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
