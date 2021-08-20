import { put, select, call, delay } from 'typed-redux-saga';
import { initActions } from '../../init/init.slice';

import nodejs from 'zbayapp-nodejs-mobile-react-native';
import { initSelectors } from '../../init/init.selectors';

export function* startWaggleSaga(): Generator {
  while(true) {
    const dataDirectoryPath = yield* select(initSelectors.dataDirectoryPath);
    const hiddenServiceAddress = yield* select(initSelectors.hiddenServiceAddress);
    if(dataDirectoryPath != '' && hiddenServiceAddress != '') {
      yield* put(
        initActions.updateInitDescription(
          'Data is being retrieved from a distributed database',
        ),
      );
      yield* put(
        initActions.onWaggleStarted(true)
      );
      yield* call(startNodeProcess, dataDirectoryPath, hiddenServiceAddress)      
      break;
    }
    yield* delay(500);
  }
}

export const startNodeProcess = (dataDirectoryPath: string, hiddenServiceAddress: string) => {
  nodejs.start(`node_modules/waggle/lib/mobileWaggleManager.js -a ${hiddenServiceAddress}.onion -p 9010 -s 39050 -d ${dataDirectoryPath}`)
}
