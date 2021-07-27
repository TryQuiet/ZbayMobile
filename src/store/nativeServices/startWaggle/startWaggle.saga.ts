import { NativeModules, Platform } from "react-native";
import { call } from "typed-redux-saga";
import { checkLibsVersionSaga } from "../../assets/checkLibsVersion/checkLibsVersion.saga";
import { checkWaggleVersionSaga } from "../../assets/checkWaggleVersion/checkWaggleVersion.saga";

export function* startWaggleSaga(): Generator {
    if (Platform.OS === 'android') {
        yield* checkLibsVersionSaga();
        yield* checkWaggleVersionSaga();
        yield* call(() => { 
                NativeModules.Integrator.startWaggle() 
            }
        )
    }
}
