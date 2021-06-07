import Config from 'react-native-config';
import { select, fork } from 'typed-redux-saga';
import { assetsSelectors } from '../assets.selectors';
import { startDownload } from '../manageDownload/manageDownload.saga';

export function* checkWaggleVersionSaga(): Generator {
  const currentVersion = yield select(assetsSelectors.currentWaggleVersion);
  if (
    JSON.stringify(currentVersion) !== JSON.stringify(Config.WAGGLE_VERSION)
  ) {
    const url = Config.S3 + '.waggle';
    yield* fork(
      startDownload,
      url,
      'waggle',
      Config.WAGGLE_VERSION,
      Config.WAGGLE_MD5,
    );
  }
}
