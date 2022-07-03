import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpAdapterService } from './http-adapter.service';
import serverMock from 'xhr-mock';
import { HttpClientModule } from '@angular/common/http';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';

describe('HttpAdapterService', () => {
  let serviceUnderTest: HttpAdapterService;

  let actualResult: any;
  let expectedReturnedResult: any;
  let actualBodySent: any;
  let fakeUrlArg: string;
  let fakeBodyArg: any;
  let observerSpy: SubscriberSpy<any>;

  Given(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpAdapterService]
    });

    serviceUnderTest = TestBed.inject(HttpAdapterService);

    actualResult = undefined;
    expectedReturnedResult = undefined;
    actualBodySent = undefined;
    fakeUrlArg = undefined;
    fakeBodyArg = undefined;
    observerSpy = undefined;

    serverMock.setup();
  });

  afterEach(() => {
    serverMock.teardown();
  });

  describe('METHOD: patch', () => {
    Given(() => {
      fakeUrlArg = '/fake';
      fakeBodyArg = {
        fake: 'body'
      };

      expectedReturnedResult = {
        fake: 'result'
      };

      serverMock.patch(fakeUrlArg, (request, response) => {
        actualBodySent = JSON.parse(request.body());
        return response.status(200).body(JSON.stringify(expectedReturnedResult));
      });
    });

    When(() => {
      observerSpy = subscribeSpyTo(serviceUnderTest.patch(fakeUrlArg, fakeBodyArg));
    });

    Then(() => {
      expect(observerSpy.getLastValue()).toEqual(expectedReturnedResult);
    });
  });

  describe('METHOD: post', () => {
    Given(() => {
      actualBodySent = undefined;
      fakeUrlArg = '/fake';
      fakeBodyArg = {
        fake: 'body'
      };

      expectedReturnedResult = {
        fake: 'result'
      };

      serverMock.post(fakeUrlArg, (request, response) => {
        actualBodySent = JSON.parse(request.body());
        return response.status(200).body(JSON.stringify(expectedReturnedResult));
      });
    });

    When(() => {
      observerSpy = subscribeSpyTo(serviceUnderTest.post(fakeUrlArg, fakeBodyArg));
    });

    Then(() => {
      expect(observerSpy.getLastValue()).toEqual(expectedReturnedResult);
      expect(actualBodySent).toEqual(fakeBodyArg);
    });
  });

  describe('METHOD: get', () => {
    Given(() => {
      fakeUrlArg = '/fake';

      expectedReturnedResult = {
        fake: 'result'
      };

      serverMock.get(fakeUrlArg, (request, response) => {
        return response.status(200).body(JSON.stringify(expectedReturnedResult));
      });
    });

    When(
      fakeAsync(() => {
        serviceUnderTest.get(fakeUrlArg).subscribe((result) => (actualResult = result));
      })
    );

    Then(() => {
      expect(actualResult).toEqual(expectedReturnedResult);
    });
  });
});
