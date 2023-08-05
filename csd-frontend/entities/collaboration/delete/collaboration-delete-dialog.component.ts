import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICollaboration } from '../collaboration.model';
import { CollaborationService } from '../service/collaboration.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './collaboration-delete-dialog.component.html',
})
export class CollaborationDeleteDialogComponent {
  collaboration?: ICollaboration;

  constructor(protected collaborationService: CollaborationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.collaborationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
