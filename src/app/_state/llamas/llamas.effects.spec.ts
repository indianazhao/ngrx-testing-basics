import { loadLlamaSuccess } from './llamas-api.actions';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideAutoSpy, Spy } from 'jasmine-auto-spies';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { createFakeLlama } from 'src/app/_types/llama.fake';
import { LlamaRemoteService } from './llama-remote.service';
import { llamaPageEnter } from 'src/app/llama-page/llama-page.actions';
import { frontPageEnter } from './../../front/front.actions';
import { Llama } from 'src/app/_types/llama.type';
import { LlamasEffects } from './llamas.effects';

describe('LlamasEffects', () => {
  let serviceUnderTest: LlamasEffects;
  let observerSpy: SubscriberSpy<any>;
  let fakeLlamas: Llama[];
  // 事實上 Action 是 observable
  let fakeActions$: Observable<Action>;
  let llamaRemoteServiceSpy: Spy<LlamaRemoteService>;

  Given(() => {
    TestBed.configureTestingModule({
      providers: [
        LlamasEffects,
        // 使用 provideMockActions() 建立 fake actions
        provideMockActions(() => fakeActions$),
        provideAutoSpy(LlamaRemoteService),
      ],
    });

    serviceUnderTest = TestBed.inject(LlamasEffects);
    llamaRemoteServiceSpy = TestBed.inject<any>(LlamaRemoteService);

    observerSpy = undefined;
    fakeLlamas = undefined;
    fakeActions$ = undefined;
  });

  describe('EFFECT: loadLlamas$', () => {
    // 目前只想確認 trigger 有發生作用，所以我們不關心 trigger 後回傳內容，只要確認 trigger 後回傳了幾次就好。
    describe('GIVEN frontPageEnter and llamaPageEnter emitted', () => {
      Given(() => {
        // input actions
        // 當我們訂閱 loadLlamas$，會觸發 provideMockActions 的 callback (產生兩個 actions)
        fakeActions$ = of(frontPageEnter, llamaPageEnter);
        // fake the getMany
        // 根據 just enough principle，只需要確保完成，不管回傳內容
        llamaRemoteServiceSpy.getMany.and.nextWith();
      });

      When(() => {
        // subscribe to effect
        observerSpy = subscribeSpyTo(serviceUnderTest.loadLlamas$);
      });

      Then('expect 2 results', () => {
        expect(observerSpy.getValuesLength()).toBe(2);
      });
    });

    // 接下來針對 Just Enough Princple 中的 Operators 進行測試 Flattening operators testing
    describe(`GIVEN 2 requests, first one with a delay of 1000ms
              WHEN subscribing`, () => {
      let fakeLlamas1: Llama[];
      let fakeLlamas2: Llama[];

      Given(() => {
        fakeLlamas1 = [createFakeLlama({ name: 'FIRST REQUEST LLAMA' })];
        fakeLlamas2 = [createFakeLlama({ name: 'SECOND REQUEST LLAMA' })];

        // 我們不關心有哪些 action，只關心有 2 個 actions
        fakeActions$ = of(frontPageEnter, frontPageEnter);

        // jasmine-auto-spies 提供了 nextWithPerCall() 這個方便的函式：
        // 這裡每次呼叫 getMany()，就會依序呼叫後面提供陣列的元素 (按照給定的 delay)
        llamaRemoteServiceSpy.getMany.and.nextWithPerCall([
          { value: fakeLlamas1, delay: 1000 },
          { value: fakeLlamas2 },
        ]);
      });

      When(
        fakeAsync(() => {
          observerSpy = subscribeSpyTo(serviceUnderTest.loadLlamas$);
          tick(1000);
        }),
      );

      Then('the second request should be first', () => {
        // 我們關心的是 action，不是直接檢查 fakeLlamas
        // expect(observerSpy.getValues()).toEqual([fakeLlamas2, fakeLlamas1]);

        const expectedActionFakeLlama1 = loadLlamaSuccess({ llamas: fakeLlamas1 });
        const expectedActionFakeLlama2 = loadLlamaSuccess({ llamas: fakeLlamas2 });
        expect(observerSpy.getValues()).toEqual([
          expectedActionFakeLlama2,
          expectedActionFakeLlama1,
        ]);
      });
    });
  });
});
