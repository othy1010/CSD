import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SolutionDetailComponent } from './solution-detail.component';

describe('Solution Management Detail Component', () => {
  let comp: SolutionDetailComponent;
  let fixture: ComponentFixture<SolutionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolutionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ solution: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SolutionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SolutionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load solution on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.solution).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
