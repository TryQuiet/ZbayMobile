import Config from 'react-native-config';
import {
  DocumentDirectoryPath,
  downloadFile,
  exists,
  unlink,
} from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';
import DeviceInfo from 'react-native-device-info';
import { eventChannel } from '@redux-saga/core';
import { END } from 'redux-saga';

/* export const downloadWaggle = async () => {
  // Remove outdated files
  const waggle = DocumentDirectoryPath + '/waggle';
  if (await exists(waggle)) {
    unlink(waggle);
  }
 
  const abi = await DeviceInfo.supportedAbis().then(
    (abis: string[]) => abis[0],
  );
 
  console.log('supported abi: ' + abi);
 
  const file = DocumentDirectoryPath + '/waggle.zip';
 
  const download = downloadFile({
    fromUrl:
      'https://s3.amazonaws.com/release.zbay.mobile.waggle' +
      '/' +
      Config.WAGGLE_VERSION +
      '/' +
      abi +
      '/' +
      'waggle.zip',
    toFile: file,
    background: true,
    progressDivider: 1,
    progress: data => {
      const percentage = (100 * data.bytesWritten) / data.contentLength;
      console.log('Waggle download progress: ', percentage);
    },
  });
 
  const downloadResult = await download.promise;
  if (downloadResult.statusCode !== 200) {
    return -1;
  }
 
  console.log('Waggle download finished: ' + downloadResult.statusCode);
 
  const destination = DocumentDirectoryPath + '/';
  const unzipResult = await unzip(file, destination);
  if (unzipResult !== destination) {
    return -1;
  }
 
  console.log('Unzip completed at: ' + unzipResult);
 
  await unlink(file);
 
  return 0;
}; */

export const downloadWaggle = () => {
  return eventChannel<number | Error>(emitter => {
    return async () => {
      // Remove outdated files
      const waggle = DocumentDirectoryPath + '/waggle';
      if (await exists(waggle)) {
        unlink(waggle);
      }

      const abi = await DeviceInfo.supportedAbis().then(
        (abis: string[]) => abis[0],
      );

      console.log('supported abi: ' + abi);

      const file = DocumentDirectoryPath + '/waggle.zip';

      const download = downloadFile({
        fromUrl:
          'https://s3.amazonaws.com/release.zbay.mobile.waggle' +
          '/' +
          Config.WAGGLE_VERSION +
          '/' +
          abi +
          '/' +
          'waggle.zip',
        toFile: file,
        background: true,
        progressDivider: 1,
        progress: data => {
          const percentage = (100 * data.bytesWritten) / data.contentLength;
          console.log('Waggle download progress: ', percentage);
          emitter(percentage);
        },
      });

      const downloadResult = await download.promise;
      console.log('Waggle download finished: ' + downloadResult.statusCode);

      if (downloadResult.statusCode !== 200) {
        emitter(new Error('Download failed: ' + downloadResult.statusCode));
      }

      const destination = DocumentDirectoryPath + '/';
      const unzipResult = await unzip(file, destination);
      console.log('Unzip completed at: ' + unzipResult);

      await unlink(file);

      emitter(END);

      return () => {};
    };
  });
};
