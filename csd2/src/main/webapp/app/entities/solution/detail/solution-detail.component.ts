import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISolution } from '../solution.model';

@Component({
  selector: 'jhi-solution-detail',
  templateUrl: './solution-detail.component.html',
})
export class SolutionDetailComponent implements OnInit {
  solution: ISolution | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ solution }) => {
      this.solution = solution;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
