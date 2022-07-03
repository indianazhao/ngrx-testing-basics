import { createAction, props } from '@ngrx/store';
import { Llama } from '../_types/llama.type';

export const llamaPageEnter = createAction('[Llama Page] Enter');
export const saveLlama = createAction(
  '[Llama page] Save Llama',
  props<{ llama: Llama }>(),
);
