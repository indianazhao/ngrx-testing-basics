import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SubscriberSpy } from '@hirez_io/observer-spy';
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
});
