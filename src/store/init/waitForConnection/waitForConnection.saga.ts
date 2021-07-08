import { put, select, call, delay } from 'typed-redux-saga';
import { ScreenNames } from '../../../const/ScreenNames.enum';
import { replaceScreen } from '../../../utils/functions/replaceScreen/replaceScreen';
import { identitySelectors } from '../../identity/identity.selectors';
import { identityActions } from '../../identity/identity.slice';
import { initActions } from '../init.slice';

export function* waitForConnectionSaga(): Generator {
  yield* put(identityActions.requestPeerId());

  let peerId: string | null = null;

  while (true) {
    peerId = yield* select(identitySelectors.peerId);
    if (peerId !== null) {
      break;
    }
    yield* delay(500);
  }

  const userCsr = yield* select(identitySelectors.userCertificate);
  if (userCsr !== null) {
    yield* put(initActions.setIsRestored(true));
    yield* call(replaceScreen, ScreenNames.MainScreen);
  } else {
    yield* call(replaceScreen, ScreenNames.RegistrationScreen);
  }
}
