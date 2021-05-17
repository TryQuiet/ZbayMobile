import {Socket} from 'socket.io-client';
import {all} from 'typed-redux-saga';
import {takeEvery} from 'typed-redux-saga';
import {getPublicChannelsSaga} from './getPublicChannels/getPublicChannels.saga';
import {loadAllMessagesSaga} from './loadAllMessages/loadAllMessages.saga';
import {publicChannelsActions} from './publicChannels.slice';

export function* publicChannelsMasterSaga(socket: Socket): Generator {
  yield all([
    takeEvery(
      publicChannelsActions.getPublicChannels.type,
      getPublicChannelsSaga,
      socket,
    ),
    takeEvery(
      publicChannelsActions.responseLoadAllMessages.type,
      loadAllMessagesSaga,
      socket,
    ),
  ]);
}
