import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIntent } from '../intent.model';

@Component({
  selector: 'csdintent-detail',
  templateUrl: './intent-detail.component.html',
})
export class IntentDetailComponent implements OnInit {
  intent: IIntent | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ intent }) => {
      this.intent = intent;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
