import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DecisionPatternDetailComponent } from './decision-pattern-detail.component';

describe('DecisionPattern Management Detail Component', () => {
  let comp: DecisionPatternDetailComponent;
  let fixture: ComponentFixture<DecisionPatternDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecisionPatternDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ decisionPattern: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DecisionPatternDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DecisionPatternDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load decisionPattern on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.decisionPattern).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
