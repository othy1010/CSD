import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CollaborationDetailComponent } from './collaboration-detail.component';

describe('Collaboration Management Detail Component', () => {
  let comp: CollaborationDetailComponent;
  let fixture: ComponentFixture<CollaborationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollaborationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ collaboration: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CollaborationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CollaborationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load collaboration on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.collaboration).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
