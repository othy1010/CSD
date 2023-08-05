import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICollaboration } from '../collaboration.model';

@Component({
  selector: 'csdcollaboration-detail',
  templateUrl: './collaboration-detail.component.html',
})
export class CollaborationDetailComponent implements OnInit {
  collaboration: ICollaboration | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ collaboration }) => {
      this.collaboration = collaboration;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
