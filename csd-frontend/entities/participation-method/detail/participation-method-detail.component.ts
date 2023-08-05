import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParticipationMethod } from '../participation-method.model';

@Component({
  selector: 'csdparticipation-method-detail',
  templateUrl: './participation-method-detail.component.html',
})
export class ParticipationMethodDetailComponent implements OnInit {
  participationMethod: IParticipationMethod | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ participationMethod }) => {
      this.participationMethod = participationMethod;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
