import { all, takeEvery } from 'typed-redux-saga';
import { createUserCsrSaga } from './createUserCsr/createUserCsr.saga';
import { identityActions } from './identity.slice';

export function* identityMasterSaga(): Generator {
  yield all([takeEvery(identityActions.createUserCsr.type, createUserCsrSaga)]);
}
