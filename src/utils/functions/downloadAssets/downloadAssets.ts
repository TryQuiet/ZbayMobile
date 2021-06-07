import { eventChannel } from '@redux-saga/core';
import md5File from 'md5-file';
import { downloadFile } from 'react-native-fs';
import { assetsActions } from '../../../store/assets/assets.slice';
import { END } from 'redux-saga';

export const downloadAssets = (
  url: string,
  path: string,
  extension: string,
) => {
  return eventChannel<
    | ReturnType<typeof assetsActions.setDownloadProgress>
    | ReturnType<typeof assetsActions.throwDownloadError>
    | ReturnType<typeof assetsActions.throwDownloadCompleted>
  >(emit => {
    (async () => {
      const download = downloadFile({
        fromUrl: url,
        toFile: path + extension,
        background: true,
        progressDivider: 1,
        progress: data => {
          const percentage = (100 * data.bytesWritten) / data.contentLength;
          emit(assetsActions.setDownloadProgress(percentage));
        },
      });

      const downloadResult = await download.promise;

      if (downloadResult.statusCode !== 200) {
        emit(assetsActions.throwDownloadError('HTTP ' + downloadResult));
      } else {
        emit(assetsActions.throwDownloadCompleted());
      }

      emit(END);
    })();
    return () => {};
  });
};

export const md5Check = async (path: string, expected: string) => {
  const actual = await md5File(path);
  return JSON.stringify(actual) === JSON.stringify(expected);
};
