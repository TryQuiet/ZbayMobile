import { all, fork } from 'typed-redux-saga';
import { checkLibsVersionSaga } from './checkLibsVersion/checkLibsVersion.saga';
import { checkWaggleVersionSaga } from './checkWaggleVersion/checkWaggleVersion.saga';

export function* assetsMasterSaga(): Generator {
  yield all([fork(checkLibsVersionSaga), fork(checkWaggleVersionSaga)]);
}
