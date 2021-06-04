import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import { DocumentDirectoryPath, exists, unlink } from 'react-native-fs';
import { select } from 'redux-saga/effects';
import { call, fork, put, take } from 'typed-redux-saga';
import { unzip } from 'react-native-zip-archive';
import { downloadAssets } from '../../../utils/functions/downloadAssets/downloadAssets';
import { assetsSelectors } from '../assets.selectors';
import { assetsActions } from '../assets.slice';
import { nativeServicesMasterSaga } from '../../nativeServices/nativeServices.master.saga';

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
    const asset = 'waggle';
    const extension = '.zip';
    const absolutePath = DocumentDirectoryPath + '/' + asset;

    const abi = yield* call(getSupportedAbi);

    const url =
      'https://s3.amazonaws.com/release.zbay.mobile.waggle' +
      '/' +
      Config.WAGGLE_VERSION +
      '/' +
      abi +
      '/' +
      asset +
      extension;

    console.log(url);

    // Get rid of outdated assets
    yield* fork(unlinkAssets, absolutePath);

    const downloadChannel = yield* call(
      downloadAssets,
      url,
      absolutePath,
      extension,
    );
    try {
      while (true) {
        const progress = yield* take(downloadChannel);
        yield* put(assetsActions.setProgress(progress as number));
      }
    } finally {
      yield* fork(unzipAssets, absolutePath + extension);
      yield* fork(unlinkAssets, absolutePath + extension); // Remove unpcaked .zip file
      yield* put(assetsActions.setCurrentWaggleVersion(Config.WAGGLE_VERSION));
    }
  }
  yield fork(nativeServicesMasterSaga);
}

export const getSupportedAbi = async () => {
  return DeviceInfo.supportedAbis().then((abis: string[]) => abis[0]);
};

export function* unzipAssets(path: string): Generator {
  const destination = DocumentDirectoryPath + '/';
  yield* call(unzip, path, destination);
}

export function* unlinkAssets(path: string): Generator {
  const areAssetsPresent = yield* call(exists, path);
  if (areAssetsPresent) {
    yield* call(unlink, path);
  }
}
