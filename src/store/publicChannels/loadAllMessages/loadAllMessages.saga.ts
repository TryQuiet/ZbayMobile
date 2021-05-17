import {PayloadAction} from '@reduxjs/toolkit';
import {apply} from 'redux-saga/effects';
import {Socket} from 'socket.io-client';
import {SocketActionTypes} from '../../socket/const/actionTypes';
import {publicChannelsActions} from '../publicChannels.slice';

export function* loadAllMessagesSaga(
  socket: Socket,
  {payload}: PayloadAction<typeof publicChannelsActions.loadAllMessages>,
): Generator {
  yield apply(socket, socket.emit, [
    SocketActionTypes.LOAD_ALL_MESSAGES,
    payload,
  ]);
}
