import { NativeModules, Platform } from 'react-native';
import { call } from 'typed-redux-saga';

export function* startTorSaga(): Generator {
  if (Platform.OS === 'android') {
    yield* call(initAndroidServices);
  }
}

export const initAndroidServices = () => {
  NativeModules.Integrator.initAndroidServices();
};
