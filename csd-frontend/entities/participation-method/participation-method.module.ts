import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ParticipationMethodComponent } from './list/participation-method.component';
import { ParticipationMethodDetailComponent } from './detail/participation-method-detail.component';
import { ParticipationMethodUpdateComponent } from './update/participation-method-update.component';
import { ParticipationMethodDeleteDialogComponent } from './delete/participation-method-delete-dialog.component';
import { ParticipationMethodRoutingModule } from './route/participation-method-routing.module';

@NgModule({
  imports: [SharedModule, ParticipationMethodRoutingModule],
  declarations: [
    ParticipationMethodComponent,
    ParticipationMethodDetailComponent,
    ParticipationMethodUpdateComponent,
    ParticipationMethodDeleteDialogComponent,
  ],
})
export class ParticipationMethodModule {}
