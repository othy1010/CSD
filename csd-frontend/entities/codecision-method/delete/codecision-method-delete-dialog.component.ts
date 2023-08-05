import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICodecisionMethod } from '../codecision-method.model';
import { CodecisionMethodService } from '../service/codecision-method.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './codecision-method-delete-dialog.component.html',
})
export class CodecisionMethodDeleteDialogComponent {
  codecisionMethod?: ICodecisionMethod;

  constructor(protected codecisionMethodService: CodecisionMethodService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.codecisionMethodService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
