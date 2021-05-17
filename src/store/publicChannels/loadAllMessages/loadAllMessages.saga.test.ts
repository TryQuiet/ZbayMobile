
import { TestApi, testSaga } from 'redux-saga-test-plan'

import { loadAllMessagesSaga } from './loadAllMessages.saga'

describe('loadAllMessagesSaga', () => {
  const saga: TestApi = testSaga(loadAllMessagesSaga)

  beforeEach(() => {
    saga.restart()
  })

  test('should be defined', () => {
    saga.next().isDone()
  })
})
