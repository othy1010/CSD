jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CodecisionMethodService } from '../service/codecision-method.service';

import { CodecisionMethodDeleteDialogComponent } from './codecision-method-delete-dialog.component';

describe('CodecisionMethod Management Delete Component', () => {
  let comp: CodecisionMethodDeleteDialogComponent;
  let fixture: ComponentFixture<CodecisionMethodDeleteDialogComponent>;
  let service: CodecisionMethodService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CodecisionMethodDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(CodecisionMethodDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CodecisionMethodDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CodecisionMethodService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
