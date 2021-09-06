import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Registration } from '../../components/Registration/Registration.component';
import { ScreenNames } from '../../const/ScreenNames.enum';
import { initActions } from '../../store/init/init.slice';
import { RegistrationScreenProps } from './Registration.types';

export const RegistrationScreen: FC<RegistrationScreenProps> = ({ route }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initActions.setCurrentScreen(ScreenNames.RegistrationScreen));
  });

  const registerUsername = (name: string) => {};

  return (
    <Registration
      registerUsernameAction={registerUsername}
      registerUsernameError={route.params.error}
    />
  );
};
