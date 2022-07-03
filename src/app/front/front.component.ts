import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { appRoutesNames } from '../app.routes.names';
import { AppState } from '../_state/app-state.type';
import { selectLlamas } from '../_state/llamas/llamas.selectors';

import { Llama } from '../_types/llama.type';
import { frontPageEnter } from './front.actions';

@Component({
  selector: 'ld-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.scss'],
})
export class FrontComponent implements OnInit {
  llamaPageRoute = appRoutesNames.LLAMA_PAGE;

  llamas$: Observable<Llama[]> = this.store.select(selectLlamas);

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(frontPageEnter());
  }
}
