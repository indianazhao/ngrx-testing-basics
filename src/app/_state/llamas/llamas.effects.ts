/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, concatMap, map, mergeMap } from 'rxjs/operators';
import { llamaPageEnter, saveLlama } from 'src/app/llama-page/llama-page.actions';
import { frontPageEnter } from '../../front/front.actions';
import { LlamaRemoteService } from './llama-remote.service';
import { loadLlamaSuccess, saveLlamaSuccess } from './llamas-api.actions';

export const SEARCH_THROTTLE_TIME = 300;

@Injectable()
export class LlamasEffects {
  constructor(
    private actions$: Actions,
    private llamaRemoteService: LlamaRemoteService,
  ) {}

  loadLlamas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(frontPageEnter, llamaPageEnter),
      mergeMap(() =>
        this.llamaRemoteService.getMany().pipe(
          map((llamas) => loadLlamaSuccess({ llamas })),
          catchError(() => EMPTY),
        ),
      ),
    ),
  );

  saveLlama$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(saveLlama),
      concatMap(({ llama }) => {
        return this.llamaRemoteService.update(llama.id, llama).pipe(
          map((updatedLlama) => saveLlamaSuccess({ llama: updatedLlama })),
          catchError(() => EMPTY),
        );
      }),
    );
  });
}
