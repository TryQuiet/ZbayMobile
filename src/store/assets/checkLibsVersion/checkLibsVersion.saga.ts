import Config from 'react-native-config';
import { select, put } from 'typed-redux-saga';
import { assetsSelectors } from '../assets.selectors';
import { assetsActions } from '../assets.slice';
import { startDownload } from '../manageDownload/manageDownload.saga';

export function* checkLibsVersionSaga(): Generator {
  const currentVersion = yield select(assetsSelectors.currentLibsVersion);
  if (JSON.stringify(currentVersion) !== JSON.stringify(Config.LIBS_VERSION)) {
    const url = Config.S3 + '.libs';
    yield* put(
      assetsActions.setDownloadHint(
        'Downloading libraries with power to keep you safe',
      ),
    );
    yield startDownload(
      url,
      'libs',
      assetsActions.setCurrentLibsVersion(Config.LIBS_VERSION),
      Config.LIBS_VERSION,
      Config.LIBS_MD5,
    );
  }
}
