import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { InvolvedUserComponent } from './list/involved-user.component';
import { InvolvedUserDetailComponent } from './detail/involved-user-detail.component';
import { InvolvedUserUpdateComponent } from './update/involved-user-update.component';
import { InvolvedUserDeleteDialogComponent } from './delete/involved-user-delete-dialog.component';
import { InvolvedUserRoutingModule } from './route/involved-user-routing.module';

@NgModule({
  imports: [SharedModule, InvolvedUserRoutingModule],
  declarations: [InvolvedUserComponent, InvolvedUserDetailComponent, InvolvedUserUpdateComponent, InvolvedUserDeleteDialogComponent],
})
export class InvolvedUserModule {}
