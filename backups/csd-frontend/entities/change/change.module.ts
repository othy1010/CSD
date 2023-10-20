import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChangeComponent } from './list/change.component';
import { ChangeDetailComponent } from './detail/change-detail.component';
import { ChangeUpdateComponent } from './update/change-update.component';
import { ChangeDeleteDialogComponent } from './delete/change-delete-dialog.component';
import { ChangeRoutingModule } from './route/change-routing.module';

@NgModule({
  imports: [SharedModule, ChangeRoutingModule],
  declarations: [ChangeComponent, ChangeDetailComponent, ChangeUpdateComponent, ChangeDeleteDialogComponent],
})
export class ChangeModule {}
