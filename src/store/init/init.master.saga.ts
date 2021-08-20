import { PayloadAction } from '@reduxjs/toolkit';
import { NativeModules } from 'react-native';
import { put, call, all, takeEvery } from 'typed-redux-saga';
import { identityActions } from '../identity/identity.slice';
import { startConnectionSaga } from '../socket/startConnection/startConnection.saga';
import { doOnRestoreSaga } from './doOnRestore/doOnRestore.saga';
import { initActions } from './init.slice';

export function* initMasterSaga(): Generator {
  yield all([
    takeEvery(initActions.doOnRestore.type, doOnRestoreSaga),
    takeEvery(
      initActions.onTorInit.type,
      function* (): Generator {
        yield* call(NativeModules.TorModule.startHiddenService);
      }
    ),
    takeEvery(
      initActions.onOnionAdded.type,
      function* (
        action: PayloadAction<
        ReturnType<typeof initActions.onOnionAdded>['payload']
        >,
        ): Generator {
          yield* put(identityActions.storeCommonName(action.payload));
      },
    ),
    takeEvery(
      initActions.onWaggleStarted.type, 
      startConnectionSaga
    ),
  ]);
}
