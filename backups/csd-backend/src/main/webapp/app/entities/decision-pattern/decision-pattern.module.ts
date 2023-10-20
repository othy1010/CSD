import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DecisionPatternComponent } from './list/decision-pattern.component';
import { DecisionPatternDetailComponent } from './detail/decision-pattern-detail.component';
import { DecisionPatternUpdateComponent } from './update/decision-pattern-update.component';
import { DecisionPatternDeleteDialogComponent } from './delete/decision-pattern-delete-dialog.component';
import { DecisionPatternRoutingModule } from './route/decision-pattern-routing.module';

@NgModule({
  imports: [SharedModule, DecisionPatternRoutingModule],
  declarations: [
    DecisionPatternComponent,
    DecisionPatternDetailComponent,
    DecisionPatternUpdateComponent,
    DecisionPatternDeleteDialogComponent,
  ],
})
export class DecisionPatternModule {}
