import { TestApi, testSaga } from 'redux-saga-test-plan';

import { startTorSaga } from './startTor.saga';

describe('startTorSaga', () => {
  const saga: TestApi = testSaga(startTorSaga);

  beforeEach(() => {
    saga.restart();
  });

  test('should be defined', () => {
    saga
      .next()
      .isDone();
  });
});
