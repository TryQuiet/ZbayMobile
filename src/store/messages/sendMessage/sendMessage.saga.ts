import { DateTime } from 'luxon';
import { Socket } from 'socket.io-client';
import { SocketActionTypes } from '../../socket/const/actionTypes';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  keyFromCertificate,
  parseCertificate,
  sign,
} from '@zbayapp/identity/lib';
import { call, select, apply } from 'typed-redux-saga';
import { identitySelectors } from '../../identity/identity.selectors';
import { publicChannelsSelectors } from '../../publicChannels/publicChannels.selectors';
import { messagesActions } from '../messages.slice';
import { MessageTypes } from '../const/messageTypes';
import { arrayBufferToString } from 'pvutils';
import { navigateTo } from '../../../utils/functions/navigateTo/navigateTo';
import { ScreenNames } from '../../../const/ScreenNames.enum';
import { Dispatch } from 'react';
import { appImages } from '../../../../assets';
import { replaceScreen } from '../../../utils/functions/replaceScreen/replaceScreen';

export function* sendMessageSaga(
  socket: Socket,
  action: PayloadAction<
    ReturnType<typeof messagesActions.sendMessage>['payload']
  >,
): Generator {
  const csr = yield* select(identitySelectors.userCsr);
  if (!csr) {
    yield* call(navigateTo, ScreenNames.ErrorScreen, {
      onPress: (_dispatch: Dispatch<any>) => {
        replaceScreen(ScreenNames.MainScreen);
      },
      icon: appImages.zbay_icon,
      title: 'Error',
      message:
        "User secrets are missing. You're not able to send messages without it. Try to restart the app or install it again.",
    });
    return;
  }

  const certificate = yield* select(identitySelectors.userCertificate);
  if (!certificate) {
    yield* call(navigateTo, ScreenNames.ErrorScreen, {
      onPress: (_dispatch: Dispatch<any>) => {
        replaceScreen(ScreenNames.MainScreen);
      },
      icon: appImages.zbay_icon,
      title: 'Error',
      message:
        'User certificate is missing. You need it to let the others know which messages was sent by you. Try to register your username again.',
    });
    return;
  }

  const publicKey = yield* call(extractPublicKey, certificate);

  const signature = yield* call(sign, action.payload, csr.pkcs10.privateKey);

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

export const extractPublicKey = (pem: string) => {
  const certificate = parseCertificate(pem);
  return keyFromCertificate(certificate);
};
