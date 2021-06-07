import Config from 'react-native-config';
import { select, put } from 'typed-redux-saga';
import { assetsSelectors } from '../assets.selectors';
import { assetsActions } from '../assets.slice';
import { startDownload } from '../manageDownload/manageDownload.saga';

export function* checkWaggleVersionSaga(): Generator {
  const currentVersion = yield select(assetsSelectors.currentWaggleVersion);
  if (
    JSON.stringify(currentVersion) !== JSON.stringify(Config.WAGGLE_VERSION)
  ) {
    const url = Config.S3 + '.waggle';
    yield* put(
      assetsActions.setDownloadHint(
        'Downloading tools to protect your privacy',
      ),
    );
    yield startDownload(
      url,
      'waggle',
      assetsActions.setCurrentWaggleVersion(Config.WAGGLE_VERSION),
      Config.WAGGLE_VERSION,
      Config.WAGGLE_MD5,
    );
  }
}
