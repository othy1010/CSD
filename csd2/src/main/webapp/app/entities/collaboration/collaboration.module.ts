import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CollaborationComponent } from './list/collaboration.component';
import { CollaborationDetailComponent } from './detail/collaboration-detail.component';
import { CollaborationUpdateComponent } from './update/collaboration-update.component';
import { CollaborationDeleteDialogComponent } from './delete/collaboration-delete-dialog.component';
import { CollaborationRoutingModule } from './route/collaboration-routing.module';

@NgModule({
  imports: [SharedModule, CollaborationRoutingModule],
  declarations: [CollaborationComponent, CollaborationDetailComponent, CollaborationUpdateComponent, CollaborationDeleteDialogComponent],
})
export class CollaborationModule {}
