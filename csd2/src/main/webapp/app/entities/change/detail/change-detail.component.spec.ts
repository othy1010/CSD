import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChangeDetailComponent } from './change-detail.component';

describe('Change Management Detail Component', () => {
  let comp: ChangeDetailComponent;
  let fixture: ComponentFixture<ChangeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ change: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChangeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChangeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load change on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.change).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
