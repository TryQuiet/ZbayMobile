import { eventChannel } from 'redux-saga';
import { call, put, take } from 'typed-redux-saga';
import { initActions } from '../../init/init.slice';
import { NativeEventKeys } from './nativeEvent.keys';
import nativeEventEmitter from './nativeEventEmitter';

export function* nativeServicesCallbacksSaga(): Generator {
  const channel = yield* call(deviceEvents);
  while (true) {
    const action = yield* take(channel);
    yield put(action);
  }
}

export const deviceEvents = () => {
  return eventChannel<
    | ReturnType<typeof initActions.onTorInit>
    | ReturnType<typeof initActions.onOnionAdded>
    | ReturnType<typeof initActions.onWaggleStarted>
  >(emit => {
    const subscriptions = [
      nativeEventEmitter?.addListener(NativeEventKeys.TorInit, () =>
        emit(initActions.onTorInit(true)),
      ),
      nativeEventEmitter?.addListener(
        NativeEventKeys.OnionAdded,
        (address: string) => emit(initActions.onOnionAdded(address)),
      ),
      nativeEventEmitter?.addListener(NativeEventKeys.WaggleStarted, () =>
        emit(initActions.onWaggleStarted(true)),
      ),
    ];
    return () => {
      subscriptions.forEach(subscription => subscription?.remove());
    };
  });
};
