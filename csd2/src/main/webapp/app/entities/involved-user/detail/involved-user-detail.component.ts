import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IInvolvedUser } from '../involved-user.model';

@Component({
  selector: 'jhi-involved-user-detail',
  templateUrl: './involved-user-detail.component.html',
})
export class InvolvedUserDetailComponent implements OnInit {
  involvedUser: IInvolvedUser | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ involvedUser }) => {
      this.involvedUser = involvedUser;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
