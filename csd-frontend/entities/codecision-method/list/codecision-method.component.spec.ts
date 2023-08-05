import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CodecisionMethodService } from '../service/codecision-method.service';

import { CodecisionMethodComponent } from './codecision-method.component';

describe('CodecisionMethod Management Component', () => {
  let comp: CodecisionMethodComponent;
  let fixture: ComponentFixture<CodecisionMethodComponent>;
  let service: CodecisionMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'codecision-method', component: CodecisionMethodComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [CodecisionMethodComponent],
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
      .overrideTemplate(CodecisionMethodComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CodecisionMethodComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CodecisionMethodService);

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
    expect(comp.codecisionMethods?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to codecisionMethodService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCodecisionMethodIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCodecisionMethodIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
