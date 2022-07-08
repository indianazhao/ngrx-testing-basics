/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, concatMap, map, mergeMap, switchMap } from 'rxjs/operators';
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
      // 事實上，這邊不應該是 mergeMap。想像一下，如果我們有個類似自動完成的搜尋載入 llamas 功能，
      // 在輸入完一些條件後觸發載入，結果我們緊接著修改輸入條件時，確因為上一個 request 返回後覆蓋結果。
      // 這並不是我們想要的結果。所以，我們藉由 TDD 來完成這部份修改：修改測試 -> 測試錯誤 -> 修改程式。
      switchMap(() =>
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
