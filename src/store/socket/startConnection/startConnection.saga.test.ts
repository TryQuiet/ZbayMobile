import {TestApi, testSaga} from 'redux-saga-test-plan';

import {startConnectionSaga} from './startConnection.saga';

describe('startConnectionSaga', () => {
  const saga: TestApi = testSaga(startConnectionSaga);

  beforeEach(() => {
    saga.restart();
  });

  test('should be defined', () => {
    saga.next().isDone();
  });
});
