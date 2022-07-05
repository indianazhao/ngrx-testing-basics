import { TestBed } from '@angular/core/testing';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { createFakeLlama } from 'src/app/_types/llama.fake';
import { Llama } from './../../_types/llama.type';
import { AppState } from './../app-state.type';
import {
  selectLlamas,
  selectLlamaIdRouteParam,
  selectLlamaByIdParam,
} from './llamas.selectors';

describe('LlamasSelectors', () => {
  let storeSpy: MockStore<Partial<AppState>>;
  let observerSpy: SubscriberSpy<any>;
  let fakeLlamas: Llama[];

  Given(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });

    storeSpy = TestBed.inject(MockStore);

    fakeLlamas = undefined;
    observerSpy = undefined;
  });

  describe('SELECTOR: selectLlamas', () => {
    Given(() => {
      fakeLlamas = [createFakeLlama()];

      // 如果直接使用下面這行直接指定內容，會被要求 router 內容 (得再去建立一個 router spy...)，
      // selectLlamas({ llamas: fakeLlamas, router: {} });
      // 所以改用 storeSpy (這也是為什麼上面要宣告型別為 Parital 的原因)
      storeSpy.setState({
        llamas: fakeLlamas,
      });
    });

    When(() => {
      observerSpy = subscribeSpyTo(storeSpy.select(selectLlamas));
    });

    Then('should return the llamas', () => {
      expect(observerSpy.getLastValue()).toEqual(fakeLlamas);
    });
  });

  describe('SELECTOR: selectLlamaByIdParam', () => {
    const fakeLlamaId = 'FAKE LLAMA ROUTE ID';

    Given(() => {
      fakeLlamas = [
        createFakeLlama({
          id: fakeLlamaId,
        }),
      ];

      /** 我們可以直接使用 storeSpy.setState() 去更改內容，但這樣就變成了小型的 integration test！
       *  除非是非常簡單的 getter selector，否則我們不會這樣用（容易因為修改原始碼而破壞測試，例如：
       *  export const selectLlamas = createFeatureSelector<AppState, Llama[]>('llamas'); 的 'llamas' 改成其他 state
       */
      // storeSpy.setState({
      //   llamas: fakeLlamas,
      // });
      // 所以我們還是使用 overrideSelector 這種 isolation 方式
      storeSpy.overrideSelector(selectLlamas, fakeLlamas);

      storeSpy.overrideSelector(selectLlamaIdRouteParam, fakeLlamaId);
    });

    When(() => {
      observerSpy = subscribeSpyTo(storeSpy.select(selectLlamaByIdParam));
    });

    Then('should return the found llama by id', () => {
      const expectedLlama = fakeLlamas[0];
      expect(observerSpy.getLastValue()).toEqual(expectedLlama);
    });
  });
});
