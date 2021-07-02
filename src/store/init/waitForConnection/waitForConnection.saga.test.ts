import { expectSaga } from 'redux-saga-test-plan';

import { combineReducers } from '@reduxjs/toolkit';
import { StoreKeys } from '../../store.keys';
import { getRandomName, waitForConnectionSaga } from './waitForConnection.saga';
import {
  identityActions,
  identityReducer,
  IdentityState,
  UserCsr,
} from '../../identity/identity.slice';
import { initReducer, InitState } from '../init.slice';
import { replaceScreen } from '../../../utils/functions/replaceScreen/replaceScreen';
import { call } from 'redux-saga-test-plan/matchers';

describe('waitForConnectionSaga', () => {
  test('create csr', async () => {
    await expectSaga(waitForConnectionSaga)
      .withReducer(
        combineReducers({
          [StoreKeys.Init]: initReducer,
          [StoreKeys.Identity]: identityReducer,
        }),
        {
          [StoreKeys.Init]: {
            ...new InitState(),
          },
          [StoreKeys.Identity]: {
            ...new IdentityState(),
            commonName: 'commonName',
            peerId: 'peerId',
          },
        },
      )
      .provide([[call.fn(getRandomName), 'zbayNickname']])
      .put(
        identityActions.createUserCsr({
          zbayNickname: 'zbayNickname',
          commonName: 'commonName',
          peerId: 'peerId',
        }),
      )
      .hasFinalState({
        [StoreKeys.Init]: {
          ...new InitState(),
        },
        [StoreKeys.Identity]: {
          ...new IdentityState(),
          zbayNickname: 'zbayNickname',
          commonName: 'commonName',
          peerId: 'peerId',
        },
      })
      .run();
  });
  test('go to main screen', async () => {
    const userCsr = jest.fn() as unknown as UserCsr;
    await expectSaga(waitForConnectionSaga)
      .withReducer(
        combineReducers({
          [StoreKeys.Init]: initReducer,
          [StoreKeys.Identity]: identityReducer,
        }),
        {
          [StoreKeys.Init]: {
            ...new InitState(),
          },
          [StoreKeys.Identity]: {
            ...new IdentityState(),
            userCsr: userCsr,
          },
        },
      )
      .provide([[call.fn(replaceScreen), null]])
      .hasFinalState({
        [StoreKeys.Init]: {
          ...new InitState(),
          isRestored: true,
        },
        [StoreKeys.Identity]: {
          ...new IdentityState(),
          userCsr: userCsr,
        },
      })
      .run();
  });
});
