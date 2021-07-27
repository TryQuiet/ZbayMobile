import { DeviceEventEmitter } from 'react-native';
import { eventChannel } from 'redux-saga';
import { call, put, take } from 'typed-redux-saga';
import { initActions } from '../../init/init.slice';
import { DeviceEventKeys } from './deviceEvent.keys';

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
  >(emit => {
    const subscriptions = [
      DeviceEventEmitter.addListener(DeviceEventKeys.TorInit, () =>
        emit(
          initActions.onTorInit(true)
        ),
      ),
      DeviceEventEmitter.addListener(DeviceEventKeys.OnionAdded, (onion: Onion) => 
        emit(
          initActions.onOnionAdded(onion)
        ),
      ),
    ];
    return () => {
      subscriptions.forEach(subscription => subscription.remove());
    };
  });
};
