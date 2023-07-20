import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { KnowuseComponent } from './list/knowuse.component';
import { KnowuseDetailComponent } from './detail/knowuse-detail.component';
import { KnowuseUpdateComponent } from './update/knowuse-update.component';
import { KnowuseDeleteDialogComponent } from './delete/knowuse-delete-dialog.component';
import { KnowuseRoutingModule } from './route/knowuse-routing.module';

@NgModule({
  imports: [SharedModule, KnowuseRoutingModule],
  declarations: [KnowuseComponent, KnowuseDetailComponent, KnowuseUpdateComponent, KnowuseDeleteDialogComponent],
})
export class KnowuseModule {}
