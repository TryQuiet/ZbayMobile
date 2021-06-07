import { TestApi, testSaga } from 'redux-saga-test-plan';

import { manageDownloadSaga } from './manageDownload.saga';

describe('manageDownloadSaga', () => {
  const saga: TestApi = testSaga(manageDownloadSaga);

  beforeEach(() => {
    saga.restart();
  });

  test('should be defined', () => {
    saga.next().isDone();
  });
});
