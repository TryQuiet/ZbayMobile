import { expectSaga } from 'redux-saga-test-plan';
import {
  CreateUserCsrPayload,
  identityActions,
  identityReducer,
  IdentityState,
} from '../identity.slice';

import { createUserCsrSaga, initCryptoEngine } from './createUserCsr.saga';
import { combineReducers } from '@reduxjs/toolkit';
import { StoreKeys } from '../../store.keys';
import { call } from 'redux-saga-test-plan/matchers';
import { createUserCsr } from '@zbayapp/identity';

import { KeyObject } from 'crypto';
import { initReducer, InitState } from '../../init/init.slice';

describe('createUserCsrSaga', () => {
  test('create csr', async () => {
    await expectSaga(
      createUserCsrSaga,
      identityActions.createUserCsr(<CreateUserCsrPayload>{}),
    )
      .withReducer(
        combineReducers({
          [StoreKeys.Init]: initReducer,
          [StoreKeys.Identity]: identityReducer,
        }),
        {
          [StoreKeys.Init]: {
            ...new InitState(),
            isCryptoEngineInitialized: true,
          },
          [StoreKeys.Identity]: {
            ...new IdentityState(),
          },
        },
      )
      .provide([
        [
          call.fn(createUserCsr),
          {
            userCsr: 'userCsr',
            userKey: 'userKey',
            pkcs10: {
              publicKey: jest.fn() as unknown as KeyObject,
              privateKey: jest.fn() as unknown as KeyObject,
              pkcs10: 'pkcs10',
            },
          },
        ],
      ])
      .hasFinalState({
        [StoreKeys.Init]: {
          ...new InitState(),
          isCryptoEngineInitialized: true,
        },
        [StoreKeys.Identity]: {
          ...new IdentityState(),
        },
      })
      .run();
  });
  test('set crypto engine and create csr', async () => {
    await expectSaga(
      createUserCsrSaga,
      identityActions.createUserCsr(<CreateUserCsrPayload>{}),
    )
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
          },
        },
      )
      .provide([
        [call.fn(initCryptoEngine), null],
        [
          call.fn(createUserCsr),
          {
            userCsr: 'userCsr',
            userKey: 'userKey',
            pkcs10: {
              publicKey: jest.fn() as unknown as KeyObject,
              privateKey: jest.fn() as unknown as KeyObject,
              pkcs10: 'pkcs10',
            },
          },
        ],
      ])
      .hasFinalState({
        [StoreKeys.Init]: {
          ...new InitState(),
          isCryptoEngineInitialized: true,
        },
        [StoreKeys.Identity]: {
          ...new IdentityState(),
        },
      })
      .run();
  });
});
