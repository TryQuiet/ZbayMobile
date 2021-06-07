import { checkLibsVersionSaga } from './checkLibsVersion/checkLibsVersion.saga';
import { checkWaggleVersionSaga } from './checkWaggleVersion/checkWaggleVersion.saga';
import { verifyAssetsInstallationSaga } from './verifyAssetsInstallation/verifyAssetsInstallation.saga';

export function* assetsMasterSaga(): Generator {
  yield* checkLibsVersionSaga();
  yield* checkWaggleVersionSaga();
  yield* verifyAssetsInstallationSaga();
}
