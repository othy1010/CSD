import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { IntentComponent } from './list/intent.component';
import { IntentDetailComponent } from './detail/intent-detail.component';
import { IntentUpdateComponent } from './update/intent-update.component';
import { IntentDeleteDialogComponent } from './delete/intent-delete-dialog.component';
import { IntentRoutingModule } from './route/intent-routing.module';

@NgModule({
  imports: [SharedModule, IntentRoutingModule],
  declarations: [IntentComponent, IntentDetailComponent, IntentUpdateComponent, IntentDeleteDialogComponent],
})
export class IntentModule {}
