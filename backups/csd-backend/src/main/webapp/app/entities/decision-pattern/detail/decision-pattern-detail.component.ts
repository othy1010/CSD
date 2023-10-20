import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDecisionPattern } from '../decision-pattern.model';

@Component({
  selector: 'jhi-decision-pattern-detail',
  templateUrl: './decision-pattern-detail.component.html',
})
export class DecisionPatternDetailComponent implements OnInit {
  decisionPattern: IDecisionPattern | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ decisionPattern }) => {
      this.decisionPattern = decisionPattern;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
