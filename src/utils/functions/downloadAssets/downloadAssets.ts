import { eventChannel } from '@redux-saga/core';
import { downloadFile } from 'react-native-fs';
import { END } from 'redux-saga';

export const downloadAssets = (
  url: string,
  path: string,
  extension: string,
) => {
  return eventChannel<number | Error>(emitter => {
    (async () => {
      const download = downloadFile({
        fromUrl: url,
        toFile: path + extension,
        background: true,
        progressDivider: 1,
        progress: data => {
          const percentage = (100 * data.bytesWritten) / data.contentLength;
          emitter(percentage);
        },
      });

      const downloadResult = await download.promise;

      if (downloadResult.statusCode !== 200) {
        emitter(new Error('Download failed: ' + downloadResult.statusCode));
      }

      emitter(END);
    })();
    return () => {};
  });
};
