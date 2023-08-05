import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SolutionComponent } from './list/solution.component';
import { SolutionDetailComponent } from './detail/solution-detail.component';
import { SolutionUpdateComponent } from './update/solution-update.component';
import { SolutionDeleteDialogComponent } from './delete/solution-delete-dialog.component';
import { SolutionRoutingModule } from './route/solution-routing.module';

@NgModule({
  imports: [SharedModule, SolutionRoutingModule],
  declarations: [SolutionComponent, SolutionDetailComponent, SolutionUpdateComponent, SolutionDeleteDialogComponent],
})
export class SolutionModule {}
