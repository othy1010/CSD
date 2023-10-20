import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICodecisionMethod } from '../codecision-method.model';

@Component({
  selector: 'csdcodecision-method-detail',
  templateUrl: './codecision-method-detail.component.html',
})
export class CodecisionMethodDetailComponent implements OnInit {
  codecisionMethod: ICodecisionMethod | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ codecisionMethod }) => {
      this.codecisionMethod = codecisionMethod;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
