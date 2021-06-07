import Config from 'react-native-config';
import { select, fork } from 'typed-redux-saga';
import { assetsSelectors } from '../assets.selectors';
import { startDownload } from '../manageDownload/manageDownload.saga';

export function* checkLibsVersionSaga(): Generator {
  const currentVersion = yield select(assetsSelectors.currentLibsVersion);
  if (JSON.stringify(currentVersion) !== JSON.stringify(Config.LIBS_VERSION)) {
    const url = Config.S3 + '.libs';
    yield* fork(
      startDownload,
      url,
      'libs',
      Config.LIBS_VERSION,
      Config.LIBS_MD5,
    );
  }
}
