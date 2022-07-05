import { TestBed } from '@angular/core/testing';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { createFakeLlama } from 'src/app/_types/llama.fake';
import { selectLlamas } from './llamas.selectors';
import { Llama } from './../../_types/llama.type';
import { AppState } from './../app-state.type';

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
});
