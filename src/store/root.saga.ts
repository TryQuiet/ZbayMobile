import {all, fork} from 'typed-redux-saga';

import {socketMasterSaga} from './socket/socket.master.saga';
import {publicChannelsMasterSaga} from './publicChannels/publicChannels.master.saga';

export function* rootSaga(): Generator {
  yield all([fork(socketMasterSaga), fork(publicChannelsMasterSaga)]);
}
