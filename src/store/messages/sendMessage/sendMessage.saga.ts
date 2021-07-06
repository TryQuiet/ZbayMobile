import { DateTime } from 'luxon';
import { Socket } from 'socket.io-client';
import { SocketActionTypes } from '../../socket/const/actionTypes';
import { PayloadAction } from '@reduxjs/toolkit';
import { sign } from '@zbayapp/identity/lib';
import { call, select, apply } from 'typed-redux-saga';
import { identitySelectors } from '../../identity/identity.selectors';
import { publicChannelsSelectors } from '../../publicChannels/publicChannels.selectors';
import { messagesActions } from '../messages.slice';
import { MessageTypes } from '../const/messageTypes';
import { arrayBufferToString } from 'pvutils';

export function* sendMessageSaga(
  socket: Socket,
  action: PayloadAction<
    ReturnType<typeof messagesActions.sendMessage>['payload']
  >,
): Generator {
  const csr = yield* select(identitySelectors.userCsr);
  if (!csr) {
    // Provide error handling
    return;
  }
  const privateKey = csr.pkcs10.privateKey;
  const publicKey = csr.pkcs10.publicKey;

  const signature = yield* call(sign, action.payload, privateKey);

  const channel = yield* select(publicChannelsSelectors.currentChannel);

  const message = {
    id: Math.random().toString(36).substr(2, 9),
    type: MessageTypes.BASIC,
    message: action.payload,
    createdAt: DateTime.utc().toSeconds(),
    signature: arrayBufferToString(signature),
    pubKey: publicKey,
    channelId: channel,
  };

  yield* apply(socket, socket.emit, [
    SocketActionTypes.SEND_MESSAGE,
    {
      channelAddress: channel,
      message: message,
    },
  ]);
}
