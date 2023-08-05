import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IKnowuse } from '../knowuse.model';

@Component({
  selector: 'csdknowuse-detail',
  templateUrl: './knowuse-detail.component.html',
})
export class KnowuseDetailComponent implements OnInit {
  knowuse: IKnowuse | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ knowuse }) => {
      this.knowuse = knowuse;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
