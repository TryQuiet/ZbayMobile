import { DocumentDirectoryPath, exists, unlink } from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';
import { call, fork, put, take } from 'typed-redux-saga';
import {
  downloadAssets,
  md5Check,
} from '../../../utils/functions/downloadAssets/downloadAssets';
import { getSupportedAbi } from '../../../utils/functions/getSupportedAbi/getSupportedAbi';
import { assetsActions } from '../assets.slice';

export function* startDownload(
  s3: string,
  asset: string,
  versionAction:
    | ReturnType<typeof assetsActions.setCurrentLibsVersion>
    | ReturnType<typeof assetsActions.setCurrentWaggleVersion>,
  version: string,
  md5sum: string,
): Generator {
  const abi = yield* call(getSupportedAbi);

  const url = s3 + '/' + version + '/' + abi + '/' + asset + '.zip';
  const path = DocumentDirectoryPath + '/' + asset + '.zip';

  console.log(url);

  // Get rid of outdated assets
  const unzipped = path.replace(/\.[^/.]+$/, '');
  yield fork(unlinkAssets, unzipped);

  const downloadChannel = yield* call(downloadAssets, url, path);

  while (true) {
    const action = yield* take(downloadChannel);
    if (action.type === assetsActions.throwDownloadCompleted.type) {
      const sum = yield* call(md5Check, path, md5sum);
      if (sum) {
        yield completeDownload(path, versionAction);
      } else {
        yield throwDownloadError('md5sum incorrect');
      }
    } else if (action.type === assetsActions.throwDownloadError.type) {
      yield throwDownloadError('err');
    } else {
      yield put(action);
    }
  }
}

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

export function* completeDownload(
  path: string,
  setVersion:
    | ReturnType<typeof assetsActions.setCurrentWaggleVersion>
    | ReturnType<typeof assetsActions.setCurrentLibsVersion>,
): Generator {
  yield unzipAssets(path);
  yield unlinkAssets(path);
  yield put(setVersion);
}

export function* throwDownloadError(err: string): Generator {
  console.log(err);
  // TODO: Change screen and handle error
}
