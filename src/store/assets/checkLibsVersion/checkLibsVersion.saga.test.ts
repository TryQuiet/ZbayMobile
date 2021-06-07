import { TestApi, testSaga } from 'redux-saga-test-plan';

import { checkLibsVersionSaga } from './checkLibsVersion.saga';

describe('checkLibsVersionSaga', () => {
  const saga: TestApi = testSaga(checkLibsVersionSaga);

  beforeEach(() => {
    saga.restart();
  });

  test('should be defined', () => {
    saga.next().isDone();
  });
});
