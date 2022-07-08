import { LlamaRemoteService } from './llama-remote.service';
import { provideAutoSpy, Spy } from 'jasmine-auto-spies';
import { llamaPageEnter } from 'src/app/llama-page/llama-page.actions';
import { frontPageEnter } from './../../front/front.actions';
import { TestBed } from '@angular/core/testing';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
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
  });
});
