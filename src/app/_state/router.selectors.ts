import { getSelectors, RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector } from '@ngrx/store';
import { AppState } from './app-state.type';

const selectRouter = createFeatureSelector<AppState, RouterReducerState<any>>('router');

export const { selectRouteParams, selectQueryParam, selectRouteParam } =
  getSelectors(selectRouter);
