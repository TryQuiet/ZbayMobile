import { TestApi, testSaga } from 'redux-saga-test-plan';

import { verifyAssetsInstallationSaga } from './verifyAssetsInstallation.saga';

describe('verifyAssetsInstallationSaga', () => {
  const saga: TestApi = testSaga(verifyAssetsInstallationSaga);

  beforeEach(() => {
    saga.restart();
  });

  test('should be defined', () => {
    saga.next().isDone();
  });
});
