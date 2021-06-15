import { TestApi, testSaga } from 'redux-saga-test-plan';

import { doOnRestoreSaga } from './doOnRestore.saga';

describe('doOnRestoreSaga', () => {
  const saga: TestApi = testSaga(doOnRestoreSaga);

  beforeEach(() => {
    saga.restart();
  });

  test('should be defined', () => {
    saga.next().isDone();
  });
});
