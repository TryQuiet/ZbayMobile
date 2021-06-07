import { select, put } from 'typed-redux-saga';
import { assetsSelectors } from '../assets.selectors';
import { assetsActions } from '../assets.slice';

export function* verifyAssetsInstallationSaga(): Generator {
  const error = yield* select(assetsSelectors.downloadError);
  if (error === '') {
    yield put(
      assetsActions.setDownloadHint(
        'Setting up the software that will take care of your chats',
      ),
    );
    yield put(assetsActions.setAssetsReady());
  }
}
