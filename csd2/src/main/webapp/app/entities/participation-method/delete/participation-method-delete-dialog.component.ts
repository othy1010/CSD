import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IParticipationMethod } from '../participation-method.model';
import { ParticipationMethodService } from '../service/participation-method.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './participation-method-delete-dialog.component.html',
})
export class ParticipationMethodDeleteDialogComponent {
  participationMethod?: IParticipationMethod;

  constructor(protected participationMethodService: ParticipationMethodService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.participationMethodService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
