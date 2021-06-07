import { all, takeEvery } from 'typed-redux-saga';
import { assetsActions } from '../assets/assets.slice';
import { startServicesSaga } from './startServices/startServices.saga';

export function* nativeServicesMasterSaga(): Generator {
  yield all([takeEvery(assetsActions.setAssetsReady.type, startServicesSaga)]);
}
