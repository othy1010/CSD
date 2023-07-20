import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IInvolvedUser } from '../involved-user.model';
import { InvolvedUserService } from '../service/involved-user.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './involved-user-delete-dialog.component.html',
})
export class InvolvedUserDeleteDialogComponent {
  involvedUser?: IInvolvedUser;

  constructor(protected involvedUserService: InvolvedUserService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.involvedUserService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
