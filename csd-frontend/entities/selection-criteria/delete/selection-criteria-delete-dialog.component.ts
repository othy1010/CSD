import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISelectionCriteria } from '../selection-criteria.model';
import { SelectionCriteriaService } from '../service/selection-criteria.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './selection-criteria-delete-dialog.component.html',
})
export class SelectionCriteriaDeleteDialogComponent {
  selectionCriteria?: ISelectionCriteria;

  constructor(protected selectionCriteriaService: SelectionCriteriaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.selectionCriteriaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
