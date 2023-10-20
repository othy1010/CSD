import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IThreat } from '../threat.model';

@Component({
  selector: 'csdthreat-detail',
  templateUrl: './threat-detail.component.html',
})
export class ThreatDetailComponent implements OnInit {
  threat: IThreat | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ threat }) => {
      this.threat = threat;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
