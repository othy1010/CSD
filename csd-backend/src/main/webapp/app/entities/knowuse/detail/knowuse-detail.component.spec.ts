import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KnowuseDetailComponent } from './knowuse-detail.component';

describe('Knowuse Management Detail Component', () => {
  let comp: KnowuseDetailComponent;
  let fixture: ComponentFixture<KnowuseDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KnowuseDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ knowuse: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(KnowuseDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(KnowuseDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load knowuse on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.knowuse).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
