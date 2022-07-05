import { createFeatureSelector, createSelector } from '@ngrx/store';
import { appRoutesNames } from 'src/app/app.routes.names';
import { Llama } from 'src/app/_types/llama.type';
import { AppState } from '../app-state.type';
import { selectRouteParam } from '../router.selectors';

export const selectLlamas = createFeatureSelector<AppState, Llama[]>('llamas');

// 必須 export，否則無法 fake it
export const selectLlamaIdRouteParam = selectRouteParam(appRoutesNames.LLAMA_ID_PARAM);

export const selectLlamaByIdParam = createSelector(
  selectLlamas,
  selectLlamaIdRouteParam,
  (llamas, llamaId) => llamas.find((llama) => llama.id === llamaId),
);
