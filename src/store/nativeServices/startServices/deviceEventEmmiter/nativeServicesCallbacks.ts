import { DeviceEventEmitter } from 'react-native';
import { put } from 'typed-redux-saga';
import { initActions } from '../../../init/init.slice';

DeviceEventEmitter.addListener('onTorIinit', onTorIinit);
DeviceEventEmitter.addListener('onOnionAdded', onOnionAdded);
DeviceEventEmitter.addListener('onWaggleStarted', onWaggleStarted);

export function* onTorIinit(): Generator {
  yield* put(
    initActions.updateInitCheck({ event: 'tor initialized', passed: true }),
  );
}

export function* onOnionAdded(): Generator {
  yield* put(
    initActions.updateInitCheck({ event: 'onion address added', passed: true }),
  );
}

export function* onWaggleStarted(): Generator {
  yield* put(
    initActions.updateInitCheck({ event: 'waggle started', passed: true }),
  );
}
