import { TestBed } from '@angular/core/testing';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { LlamaRemoteService, LLAMAS_REMOTE_PATH } from './llama-remote.service';
import { Llama } from '../../_types/llama.type';
import { HttpAdapterService } from '../../_services/adapters/http-adapter/http-adapter.service';
import { QueryConfig } from 'src/app/_types/query-config.type';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';

describe('LlamaRemoteService', () => {
  let serviceUnderTest: LlamaRemoteService;
  let httpAdapterServiceSpy: Spy<HttpAdapterService>;

  let fakeLlamas: Llama[];
  let actualResult: any;
  let actualError: any;
  let expectedReturnedLlama: Llama;
  let observerSpy: SubscriberSpy<any>;

  Given(() => {
    TestBed.configureTestingModule({
      providers: [
        LlamaRemoteService,
        { provide: HttpAdapterService, useValue: createSpyFromClass(HttpAdapterService) },
      ],
    });

    serviceUnderTest = TestBed.inject(LlamaRemoteService);
    httpAdapterServiceSpy = TestBed.inject<any>(HttpAdapterService);

    fakeLlamas = undefined;
    actualResult = undefined;
    actualError = undefined;
    expectedReturnedLlama = undefined;
    observerSpy = undefined;
  });

  describe('METHOD: getMany', () => {
    let queryConfig: QueryConfig;

    When(() => {
      serviceUnderTest.getMany(queryConfig).subscribe((value) => (actualResult = value));
    });

    describe('GIVEN no config THEN call the default url return the llamas', () => {
      Given(() => {
        queryConfig = null;

        fakeLlamas = [{ id: 'fake id', name: 'FAKE NAME', imageFileName: 'FAKE IMAGE' }];
        httpAdapterServiceSpy.get
          .mustBeCalledWith(LLAMAS_REMOTE_PATH)
          .nextOneTimeWith(fakeLlamas);
      });
      Then(() => {
        expect(actualResult).toEqual(fakeLlamas);
      });
    });

    describe('GIVEN config with filters THEN call the url with query params return the llamas', () => {
      Given(() => {
        fakeLlamas = [{ id: 'fake id', name: 'FAKE NAME', imageFileName: 'FAKE IMAGE' }];
        queryConfig = {
          filters: {
            featured: true,
          },
        };
        const expectedUrl = LLAMAS_REMOTE_PATH + '?featured=true';

        httpAdapterServiceSpy.get
          .mustBeCalledWith(expectedUrl)
          .nextOneTimeWith(fakeLlamas);
      });
      Then(() => {
        expect(actualResult).toEqual(fakeLlamas);
      });
    });
  });

  describe('METHOD: update', () => {
    let fakeLlamaIdArg: string;
    let fakeLlamaChangesArg: Partial<Llama>;
    let errorIsExpected: boolean;

    Given(() => {
      errorIsExpected = false;
    });

    When(() => {
      observerSpy = subscribeSpyTo(
        serviceUnderTest.update(fakeLlamaIdArg, fakeLlamaChangesArg),
        {
          expectErrors: errorIsExpected,
        },
      );
    });

    describe('GIVEN update was successful', () => {
      Given(() => {
        fakeLlamaIdArg = 'FAKE ID';
        fakeLlamaChangesArg = {
          name: 'NEW FAKE LLAMA',
        };

        expectedReturnedLlama = createDefaultFakeLlama();
        expectedReturnedLlama.id = fakeLlamaIdArg;
        expectedReturnedLlama.name = 'NEW FAKE LLAMA';

        const expectedUrl = `${LLAMAS_REMOTE_PATH}/${fakeLlamaIdArg}`;
        httpAdapterServiceSpy.patch
          .mustBeCalledWith(expectedUrl, fakeLlamaChangesArg)
          .nextOneTimeWith(expectedReturnedLlama);
      });

      Then('return the updated llama', () => {
        expect(observerSpy.getLastValue()).toEqual(expectedReturnedLlama);
      });
    });

    describe('GIVEN update failed', () => {
      Given(() => {
        errorIsExpected = true;
        httpAdapterServiceSpy.patch.and.throwWith('FAKE ERROR');
      });

      Then('rethrow the error', () => {
        expect(observerSpy.getError()).toEqual('FAKE ERROR');
      });
    });
  });

  describe('METHOD: create', () => {
    let fakeBasicLlamaDetails: Partial<Llama>;

    Given(() => {
      fakeBasicLlamaDetails = {
        name: 'FAKE NAME',
        imageFileName: 'FAKE IMAGE FILE NAME',
        userId: 333333,
      };

      expectedReturnedLlama = {
        ...expectedReturnedLlama,
        id: 'FAKE ID',
        ...fakeBasicLlamaDetails,
      };

      httpAdapterServiceSpy.post
        .mustBeCalledWith(LLAMAS_REMOTE_PATH, fakeBasicLlamaDetails)
        .nextOneTimeWith(expectedReturnedLlama);
    });

    When(() => {
      observerSpy = subscribeSpyTo(serviceUnderTest.create(fakeBasicLlamaDetails));
    });

    Then('return the newly created llama', () => {
      expect(observerSpy.getLastValue()).toEqual(expectedReturnedLlama);
    });
  });

  describe('METHOD: getByUserId', () => {
    let fakeUserId: number;
    let expectedReturnedUserLlama: Llama;

    Given(() => {
      fakeUserId = 33333333;

      expectedReturnedUserLlama = createDefaultFakeLlama();
      expectedReturnedUserLlama.userId = fakeUserId;

      const url = LLAMAS_REMOTE_PATH + '?userId=' + fakeUserId;

      httpAdapterServiceSpy.get
        .mustBeCalledWith(url)
        .nextOneTimeWith([expectedReturnedUserLlama]);
    });

    When(() => {
      serviceUnderTest
        .getByUserId(fakeUserId)
        .subscribe((result) => (actualResult = result));
    });

    Then('return the llama by userId', () => {
      expect(actualResult).toEqual(expectedReturnedUserLlama);
    });
  });
});

function createDefaultFakeLlama(): Llama {
  return { id: 'FAKE ID', name: 'FAKE NAME', imageFileName: 'FAKE IMAGE' };
}
