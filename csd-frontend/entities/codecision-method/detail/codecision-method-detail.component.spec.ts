import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CodecisionMethodDetailComponent } from './codecision-method-detail.component';

describe('CodecisionMethod Management Detail Component', () => {
  let comp: CodecisionMethodDetailComponent;
  let fixture: ComponentFixture<CodecisionMethodDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CodecisionMethodDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ codecisionMethod: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CodecisionMethodDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CodecisionMethodDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load codecisionMethod on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.codecisionMethod).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
