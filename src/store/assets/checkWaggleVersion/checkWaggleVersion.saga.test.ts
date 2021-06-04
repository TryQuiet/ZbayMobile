import { TestApi, testSaga } from 'redux-saga-test-plan';

import { checkWaggleVersionSaga } from './checkWaggleVersion.saga';

describe('checkWaggleVersionSaga', () => {
  const saga: TestApi = testSaga(checkWaggleVersionSaga);

  beforeEach(() => {
    saga.restart();
  });

  test('should be defined', () => {
    saga.next().isDone();
  });
});
