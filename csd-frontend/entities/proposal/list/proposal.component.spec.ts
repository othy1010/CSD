import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProposalService } from '../service/proposal.service';

import { ProposalComponent } from './proposal.component';

describe('Proposal Management Component', () => {
  let comp: ProposalComponent;
  let fixture: ComponentFixture<ProposalComponent>;
  let service: ProposalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'proposal', component: ProposalComponent }]), HttpClientTestingModule],
      declarations: [ProposalComponent],
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
      .overrideTemplate(ProposalComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProposalComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProposalService);

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
    expect(comp.proposals?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to proposalService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getProposalIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getProposalIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
