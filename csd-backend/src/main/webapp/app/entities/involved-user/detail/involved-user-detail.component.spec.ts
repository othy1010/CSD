import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InvolvedUserDetailComponent } from './involved-user-detail.component';

describe('InvolvedUser Management Detail Component', () => {
  let comp: InvolvedUserDetailComponent;
  let fixture: ComponentFixture<InvolvedUserDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvolvedUserDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ involvedUser: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(InvolvedUserDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(InvolvedUserDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load involvedUser on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.involvedUser).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
