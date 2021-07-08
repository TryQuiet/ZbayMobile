import { Socket } from 'socket.io-client';
import { PayloadAction } from '@reduxjs/toolkit';
import { identityActions } from '../identity.slice';
import { fork, call, put, take, apply } from 'typed-redux-saga';
import { SocketActionTypes } from '../../socket/const/actionTypes';
import { eventChannel } from 'redux-saga';

export function* registerCertificateSaga(
  socket: Socket,
  action: PayloadAction<
    ReturnType<typeof identityActions.storeUserCsr>['payload']
  >,
): Generator {
  yield* fork(handleCertificateActions, socket);
  yield* apply(socket, socket.emit, [
    SocketActionTypes.CERTIFICATE_REGISTRATION_ERROR,
    action.payload,
  ]);
}

export function* handleCertificateActions(socket: Socket): Generator {
  const socketChannel = yield* call(subscribe, socket);
  while (true) {
    const action = yield* take(socketChannel);
    yield put(action);
  }
}

export function subscribe(socket: Socket) {
  return eventChannel<ReturnType<typeof identityActions.throwIdentityError>>(
    emit => {
      socket.on(
        SocketActionTypes.SEND_USER_CERTIFICATE,
        (certificate: string) => {
          emit(identityActions.storeUserCertificate(certificate));
        },
      );
      socket.on(
        SocketActionTypes.CERTIFICATE_REGISTRATION_ERROR,
        (message: string) => {
          emit(identityActions.throwIdentityError(message));
        },
      );
      return () => {};
    },
  );
}
