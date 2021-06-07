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
  version: string,
  md5sum: string,
): Generator {
  const absolutePath = DocumentDirectoryPath + '/' + asset;

  const abi = yield* call(getSupportedAbi);

  const url = s3 + '/' + version + '/' + abi + '/' + asset + '.zip';

  console.log(url);

  // Get rid of outdated assets
  yield* fork(unlinkAssets, absolutePath);

  const downloadChannel = yield* call(
    downloadAssets,
    url,
    absolutePath,
    '.zip',
  );

  while (true) {
    const action = yield* take(downloadChannel);
    if (action.type === assetsActions.throwDownloadCompleted.type) {
      const sum = yield* call(md5Check, absolutePath, md5sum);
      if (sum) {
        const setVersion = assetsActions.setCurrentWaggleVersion(version);
        yield* fork(completeDownload, absolutePath, setVersion);
      } else {
        yield* fork(throwDownloadError);
      }
    } else if (action.type === assetsActions.throwDownloadError.type) {
      yield* fork(throwDownloadError);
    } else {
      yield* put(action);
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
  yield* fork(unzipAssets, path);
  yield* fork(unlinkAssets, path);
  yield* put(setVersion);
}

export function* throwDownloadError(): Generator {
  // TODO: Change screen and handle error
}
