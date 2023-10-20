import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IKnowuse } from '../knowuse.model';
import { KnowuseService } from '../service/knowuse.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './knowuse-delete-dialog.component.html',
})
export class KnowuseDeleteDialogComponent {
  knowuse?: IKnowuse;

  constructor(protected knowuseService: KnowuseService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.knowuseService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
