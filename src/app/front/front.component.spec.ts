import { selectLlamas } from './../_state/llamas/llamas.selectors';
import { Llama } from 'src/app/_types/llama.type';
import { frontPageEnter } from './front.actions';
import { TestBed } from '@angular/core/testing';
import { Spy, provideAutoSpy } from 'jasmine-auto-spies';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FrontComponent } from './front.component';
import { AppState } from '../_state/app-state.type';
import { ObserverSpy, subscribeSpyTo, SubscriberSpy } from '@hirez_io/observer-spy';
import { createFakeLlama } from '../_types/llama.fake';

describe('FrontComponent', () => {
  let componentUnderTest: FrontComponent;

  let actualResult: any;
  // 必須指定 type，否則 storeSpy.setState() 等函數，內部不會知道要使用哪個 state
  // let storeSpy: MockStore<AppState>;
  // 如果直接使用 AppState，會需要提供所有 state 的內容，所以改用 <Partial>
  let storeSpy: MockStore<Partial<AppState>>;

  let observerSpy: SubscriberSpy<any>;

  Given(() => {
    TestBed.configureTestingModule({
      providers: [FrontComponent, provideMockStore()],
    });

    componentUnderTest = TestBed.inject(FrontComponent);
    storeSpy = TestBed.inject(MockStore);

    actualResult = undefined;
    observerSpy = undefined;
  });

  describe('INIT', () => {
    describe('WHEN subscribing to store actions', () => {
      When(() => {
        componentUnderTest.ngOnInit();

        // 使用 MokeStore spy dispatch 時，使用專用的 scannedActions$

        // 針對 observable 的測試，我們要使用 observerSpy
        // 舊方法：
        // const observerSpy = new ObserverSpy();
        // const sub = storeSpy.scannedActions$.subscribe(observerSpy);
        // sub.unsubscribe();

        // 新方法 (subscribeSpyTo 會 auto unsubscribe)
        observerSpy = subscribeSpyTo(storeSpy.scannedActions$);
      });

      Then('should dispatch the page enter action', () => {
        const expectedAction = frontPageEnter();
        expect(observerSpy.getValues()).toEqual([expectedAction]);
      });
    });

    describe('WHEN subscribing to the local llamas', () => {
      let fakeLlama: Llama[];

      Given(() => {
        fakeLlama = [createFakeLlama()];

        // 有了 fakeLlama，還得覆寫 storeSpy 的 selectLlamas
        storeSpy.overrideSelector(selectLlamas, fakeLlama);
      });

      When(() => {
        observerSpy = subscribeSpyTo(componentUnderTest.llamas$);
      });

      Then('should set the local llamas', () => {
        expect(observerSpy.getLastValue()).toEqual(fakeLlama);
      });
    });
  });
});
