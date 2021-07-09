import { RouteProp } from '@react-navigation/core';
import { ScreenNames } from './const/ScreenNames.enum';

export type RootStackParamList = {
  [ScreenNames.SplashScreen]: undefined;
  [ScreenNames.MainScreen]: undefined;
  [ScreenNames.RegistrationScreen]: {
    error: string | undefined;
  };
  [ScreenNames.ErrorScreen]: {
    error: string;
  };
};

export type RegistrationRouteProp = RouteProp<
  RootStackParamList,
  ScreenNames.RegistrationScreen
>;

export type ErrorRouteProp = RouteProp<
  RootStackParamList,
  ScreenNames.ErrorScreen
>;
