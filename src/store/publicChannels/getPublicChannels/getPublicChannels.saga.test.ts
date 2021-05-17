
import { TestApi, testSaga } from 'redux-saga-test-plan'

import { getPublicChannelsSaga } from './getPublicChannels.saga'

describe('getPublicChannelsSaga', () => {
  const saga: TestApi = testSaga(getPublicChannelsSaga)

  beforeEach(() => {
    saga.restart()
  })

  test('should be defined', () => {
    saga.next().isDone()
  })
})
