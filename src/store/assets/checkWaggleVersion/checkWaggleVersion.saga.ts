import Config from 'react-native-config';
import { select } from 'redux-saga/effects';
import { call, fork, put, take } from 'typed-redux-saga';
import { downloadWaggle } from '../../../utils/functions/downloadWaggle/downloadWaggle';
import { nativeServicesMasterSaga } from '../../nativeServices/nativeServices.master.saga';
import { assetsSelectors } from '../assets.selectors';
import { assetsActions } from '../assets.slice';

export function* checkWaggleVersionSaga(): Generator {
  const currentWaggleVersion = yield select(
    assetsSelectors.currentWaggleVersion,
  );
  if (
    /* There was a problem with comparing those two values
       workaround provided from https://stackoverflow.com/questions/53394550/string-comparison-not-working-in-javascript-when-comparing-an-environment-variab */
    JSON.stringify(currentWaggleVersion) !==
    JSON.stringify(Config.WAGGLE_VERSION)
  ) {
    const downloadChannel = yield* call(downloadWaggle);
    try {
      while (true) {
        const progress = yield* take(downloadChannel);
        yield* put(assetsActions.setProgress(progress as number));
      }
    } finally {
      downloadChannel.close();
      yield* put(assetsActions.setCurrentWaggleVersion(Config.WAGGLE_VERSION));
    }
  }
  console.log('After download waggle channel');
  yield fork(nativeServicesMasterSaga);
}
