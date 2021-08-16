import { put, call } from 'typed-redux-saga';
import { initActions } from '../../init/init.slice';

import nodejs from 'zbayapp-nodejs-mobile-react-native';

export function* startWaggleSaga(): Generator {
  yield* put(
    initActions.updateInitDescription(
      'Data is being retrieved from a distributed database',
    ),
  );
  yield* call(startNodeProcess)
}

const startNodeProcess = () => {
  nodejs.start('main.js -t whatever')
}
