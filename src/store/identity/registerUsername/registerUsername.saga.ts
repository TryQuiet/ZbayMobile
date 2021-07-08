import { PayloadAction } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';
import { select, put } from 'typed-redux-saga';
import { identitySelectors } from '../identity.selectors';
import { identityActions } from '../identity.slice';

export function* registerUsernameSaga(
  socket: Socket,
  action: PayloadAction<
    ReturnType<typeof identityActions.registerUsername>['payload']
  >,
): Generator {
  const commonName = yield* select(identitySelectors.commonName);
  const peerId = yield* select(identitySelectors.peerId);

  if (!commonName || !peerId) {
    yield* put(
      identityActions.throwIdentityError(
        "You're not connected with other peers.",
      ),
    );
    return;
  }

  const payload = {
    zbayNickname: action.payload,
    commonName: commonName,
    peerId: peerId,
  };

  yield* put(identityActions.createUserCsr(payload));
}
