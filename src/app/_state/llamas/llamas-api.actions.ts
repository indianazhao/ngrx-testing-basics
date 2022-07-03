import { createAction, props } from '@ngrx/store';
import { Llama } from '../../_types/llama.type';

export const loadLlamaSuccess = createAction(
  '[Llama API] Load Success',
  props<{ llamas: Llama[] }>(),
);
export const saveLlamaSuccess = createAction(
  '[Llama API] Save Success',
  props<{ llama: Llama }>(),
);
