import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CodecisionMethodComponent } from './list/codecision-method.component';
import { CodecisionMethodDetailComponent } from './detail/codecision-method-detail.component';
import { CodecisionMethodUpdateComponent } from './update/codecision-method-update.component';
import { CodecisionMethodDeleteDialogComponent } from './delete/codecision-method-delete-dialog.component';
import { CodecisionMethodRoutingModule } from './route/codecision-method-routing.module';

@NgModule({
  imports: [SharedModule, CodecisionMethodRoutingModule],
  declarations: [
    CodecisionMethodComponent,
    CodecisionMethodDetailComponent,
    CodecisionMethodUpdateComponent,
    CodecisionMethodDeleteDialogComponent,
  ],
})
export class CodecisionMethodModule {}
