import { all, fork } from 'typed-redux-saga';
import { checkWaggleVersionSaga } from './checkWaggleVersion/checkWaggleVersion.saga';

export function* assetsMasterSaga(): Generator {
  yield all([fork(checkWaggleVersionSaga)]);
}
