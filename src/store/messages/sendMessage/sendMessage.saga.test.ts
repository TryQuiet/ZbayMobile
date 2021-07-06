import { combineReducers } from '@reduxjs/toolkit';
import { expectSaga } from 'redux-saga-test-plan';
import { Socket } from 'socket.io-client';
import { StoreKeys } from '../../store.keys';
import {
  messagesActions,
  messagesReducer,
  MessagesState,
} from '../messages.slice';
import { sendMessageSaga } from './sendMessage.saga';

describe('sendMessageSaga', () => {
  test.skip('should be defined', () => {
    const socket = { emit: jest.fn() } as unknown as Socket;
    expectSaga(sendMessageSaga, socket, messagesActions.sendMessage('message'))
      .withReducer(combineReducers({ [StoreKeys.Messages]: messagesReducer }), {
        [StoreKeys.Messages]: {
          ...new MessagesState(),
        },
      })
      .hasFinalState({
        [StoreKeys.Messages]: {
          ...new MessagesState(),
        },
      })
      .run();
  });
});
