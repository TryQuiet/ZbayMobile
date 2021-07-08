/* eslint-disable prettier/prettier */
import { Socket } from 'socket.io-client';
import { all, call, takeEvery } from 'typed-redux-saga';
import { ScreenNames } from '../../const/ScreenNames.enum';
import { replaceScreen } from '../../utils/functions/replaceScreen/replaceScreen';
import { createUserCsrSaga } from './createUserCsr/createUserCsr.saga';
import { handleIdentityError } from './handleIdentityError/handleIdentityError.saga';
import { identityActions } from './identity.slice';
import { registerCertificateSaga } from './registerCertificate/registerCertificate.saga';
import { registerUsernameSaga } from './registerUsername/registerUsername.saga';

export function* identityMasterSaga(socket: Socket): Generator {
  yield all([
    takeEvery(
      identityActions.registerUsername.type,
      registerUsernameSaga,
      socket,
    ),
    takeEvery(
      identityActions.createUserCsr.type,
      createUserCsrSaga
    ),
    takeEvery(
      identityActions.storeUserCsr.type,
      registerCertificateSaga,
      socket,
    ),
    takeEvery(identityActions.storeUserCertificate.type, function* () {
      yield* call(replaceScreen, ScreenNames.MainScreen);
    }),
    takeEvery(
      identityActions.throwIdentityError.type,
      handleIdentityError
    ),
  ]);
}
