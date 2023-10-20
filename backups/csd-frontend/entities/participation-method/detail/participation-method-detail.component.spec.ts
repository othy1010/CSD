import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParticipationMethodDetailComponent } from './participation-method-detail.component';

describe('ParticipationMethod Management Detail Component', () => {
  let comp: ParticipationMethodDetailComponent;
  let fixture: ComponentFixture<ParticipationMethodDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipationMethodDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ participationMethod: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ParticipationMethodDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ParticipationMethodDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load participationMethod on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.participationMethod).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
