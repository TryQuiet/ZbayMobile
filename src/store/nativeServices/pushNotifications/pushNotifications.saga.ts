import { AppRegistry, NativeModules, Platform } from 'react-native';
import { call, take } from 'typed-redux-saga';
import { pushNotifications } from '../../../services/pushNotifications/pushNotifications.service';

export function* pushNotificationsSaga(): Generator {
  const os = yield* take(Platform.OS);
  if (os === 'android') {
    yield* call(initPushNotifications);
  }
}

export const initPushNotifications = () => {
  AppRegistry.registerHeadlessTask(
    'pushNotifications',
    () => pushNotifications,
  );
  /* Start service to handle notifications for incoming messages, even when the app is in background */
  NativeModules.Integrator.initPushNotifications();
};
