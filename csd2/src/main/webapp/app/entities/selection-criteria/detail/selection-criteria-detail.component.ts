import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISelectionCriteria } from '../selection-criteria.model';

@Component({
  selector: 'jhi-selection-criteria-detail',
  templateUrl: './selection-criteria-detail.component.html',
})
export class SelectionCriteriaDetailComponent implements OnInit {
  selectionCriteria: ISelectionCriteria | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ selectionCriteria }) => {
      this.selectionCriteria = selectionCriteria;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
