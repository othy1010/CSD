import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ThreatComponent } from './list/threat.component';
import { ThreatDetailComponent } from './detail/threat-detail.component';
import { ThreatUpdateComponent } from './update/threat-update.component';
import { ThreatDeleteDialogComponent } from './delete/threat-delete-dialog.component';
import { ThreatRoutingModule } from './route/threat-routing.module';

@NgModule({
  imports: [SharedModule, ThreatRoutingModule],
  declarations: [ThreatComponent, ThreatDetailComponent, ThreatUpdateComponent, ThreatDeleteDialogComponent],
})
export class ThreatModule {}
