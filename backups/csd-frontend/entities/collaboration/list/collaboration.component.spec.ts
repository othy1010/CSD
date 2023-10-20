import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CollaborationService } from '../service/collaboration.service';

import { CollaborationComponent } from './collaboration.component';

describe('Collaboration Management Component', () => {
  let comp: CollaborationComponent;
  let fixture: ComponentFixture<CollaborationComponent>;
  let service: CollaborationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'collaboration', component: CollaborationComponent }]), HttpClientTestingModule],
      declarations: [CollaborationComponent],
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
      .overrideTemplate(CollaborationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CollaborationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CollaborationService);

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
    expect(comp.collaborations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to collaborationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCollaborationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCollaborationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
