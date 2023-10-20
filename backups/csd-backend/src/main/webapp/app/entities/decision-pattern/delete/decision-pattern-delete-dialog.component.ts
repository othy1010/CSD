import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDecisionPattern } from '../decision-pattern.model';
import { DecisionPatternService } from '../service/decision-pattern.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './decision-pattern-delete-dialog.component.html',
})
export class DecisionPatternDeleteDialogComponent {
  decisionPattern?: IDecisionPattern;

  constructor(protected decisionPatternService: DecisionPatternService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.decisionPatternService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
