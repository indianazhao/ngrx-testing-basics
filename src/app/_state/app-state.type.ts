import { Llama } from '../_types/llama.type';
import { RouterReducerState } from '@ngrx/router-store';

export interface AppState {
  llamas: Llama[];
  router: RouterReducerState<any>;
}
