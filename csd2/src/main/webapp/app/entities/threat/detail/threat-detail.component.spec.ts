import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ThreatDetailComponent } from './threat-detail.component';

describe('Threat Management Detail Component', () => {
  let comp: ThreatDetailComponent;
  let fixture: ComponentFixture<ThreatDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThreatDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ threat: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ThreatDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ThreatDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load threat on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.threat).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
