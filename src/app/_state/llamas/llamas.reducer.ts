import { createReducer, on } from '@ngrx/store';
import { Llama } from '../../_types/llama.type';
import { loadLlamaSuccess, saveLlamaSuccess } from './llamas-api.actions';

export const initialState: Llama[] = [];

export const llamaReducer = createReducer(
  initialState,
  on(loadLlamaSuccess, (oldLlamas, { llamas }) => llamas),
  on(saveLlamaSuccess, (oldLlamas, { llama }) => {
    const foundLlama = oldLlamas.find((oldLlama) => oldLlama.id === llama.id);

    if (foundLlama) {
      const index = oldLlamas.indexOf(foundLlama);
      const clonedLlamas = [...oldLlamas];
      const clonedLlama = { ...foundLlama, ...llama };
      clonedLlamas[index] = clonedLlama;
      return clonedLlamas;
    }
    return oldLlamas;
  }),
);
