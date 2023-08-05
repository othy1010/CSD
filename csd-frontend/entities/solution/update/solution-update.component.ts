import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SolutionFormService, SolutionFormGroup } from './solution-form.service';
import { ISolution } from '../solution.model';
import { SolutionService } from '../service/solution.service';

@Component({
  selector: 'csdsolution-update',
  templateUrl: './solution-update.component.html',
})
export class SolutionUpdateComponent implements OnInit {
  isSaving = false;
  solution: ISolution | null = null;

  editForm: SolutionFormGroup = this.solutionFormService.createSolutionFormGroup();

  constructor(
    protected solutionService: SolutionService,
    protected solutionFormService: SolutionFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ solution }) => {
      this.solution = solution;
      if (solution) {
        this.updateForm(solution);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const solution = this.solutionFormService.getSolution(this.editForm);
    if (solution.id !== null) {
      this.subscribeToSaveResponse(this.solutionService.update(solution));
    } else {
      this.subscribeToSaveResponse(this.solutionService.create(solution));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISolution>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(solution: ISolution): void {
    this.solution = solution;
    this.solutionFormService.resetForm(this.editForm, solution);
  }
}
