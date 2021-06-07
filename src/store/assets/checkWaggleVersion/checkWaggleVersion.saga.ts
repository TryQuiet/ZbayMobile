import Config from 'react-native-config';
import { select, put, call, take } from 'typed-redux-saga';
import { ScreenNames } from '../../../const/ScreenNames.enum';
import { navigateTo } from '../../../utils/functions/navigateTo/navigateTo';
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
    while (true) {
      try {
        yield* call(navigateTo, ScreenNames.SplashScreen);
        yield startDownload(
          url,
          'waggle',
          assetsActions.setCurrentWaggleVersion(Config.WAGGLE_VERSION),
          Config.WAGGLE_VERSION,
          Config.WAGGLE_MD5,
        );
        break;
      } catch (e) {
        yield* call(navigateTo, ScreenNames.ErrorScreen, {
          error: (e as Error).message,
        });
        yield take(assetsActions.retryDownload.type);
      }
    }
  }
}
