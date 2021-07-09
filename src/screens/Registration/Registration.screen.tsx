import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Registration } from '../../components/Registration/Registration.component';
import { identityActions } from '../../store/identity/identity.slice';
import { RegistrationScreenProps } from './Registration.types';

export const RegistrationScreen: FC<RegistrationScreenProps> = ({ route }) => {
  const dispatch = useDispatch();

  const registerUsername = (name: string) => {
    dispatch(identityActions.registerUsername(name));
  };

  return (
    <Registration
      registerUsernameAction={registerUsername}
      registerUsernameError={route.params.error}
    />
  );
};
