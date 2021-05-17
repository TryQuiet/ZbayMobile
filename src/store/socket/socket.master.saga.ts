import {all} from 'typed-redux-saga';
import {takeEvery} from 'typed-redux-saga';
import {socketActions} from './socket.slice';
import {startConnectionSaga} from './startConnection/startConnection.saga';

export function* socketMasterSaga(): Generator {
  yield all([
    takeEvery(socketActions.connectToWebsocketServer, startConnectionSaga),
  ]);
}
