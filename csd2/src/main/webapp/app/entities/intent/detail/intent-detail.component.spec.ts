import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { IntentDetailComponent } from './intent-detail.component';

describe('Intent Management Detail Component', () => {
  let comp: IntentDetailComponent;
  let fixture: ComponentFixture<IntentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ intent: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(IntentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(IntentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load intent on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.intent).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
