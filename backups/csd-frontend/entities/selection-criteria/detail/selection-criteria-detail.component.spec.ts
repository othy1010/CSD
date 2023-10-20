import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SelectionCriteriaDetailComponent } from './selection-criteria-detail.component';

describe('SelectionCriteria Management Detail Component', () => {
  let comp: SelectionCriteriaDetailComponent;
  let fixture: ComponentFixture<SelectionCriteriaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectionCriteriaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ selectionCriteria: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SelectionCriteriaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SelectionCriteriaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load selectionCriteria on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.selectionCriteria).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
