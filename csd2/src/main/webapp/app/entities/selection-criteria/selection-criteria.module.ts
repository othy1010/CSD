import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SelectionCriteriaComponent } from './list/selection-criteria.component';
import { SelectionCriteriaDetailComponent } from './detail/selection-criteria-detail.component';
import { SelectionCriteriaUpdateComponent } from './update/selection-criteria-update.component';
import { SelectionCriteriaDeleteDialogComponent } from './delete/selection-criteria-delete-dialog.component';
import { SelectionCriteriaRoutingModule } from './route/selection-criteria-routing.module';

@NgModule({
  imports: [SharedModule, SelectionCriteriaRoutingModule],
  declarations: [
    SelectionCriteriaComponent,
    SelectionCriteriaDetailComponent,
    SelectionCriteriaUpdateComponent,
    SelectionCriteriaDeleteDialogComponent,
  ],
})
export class SelectionCriteriaModule {}
