import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Registration } from '../../components/Registration/Registration.component';
import { identityActions } from '../../store/identity/identity.slice';

export const RegistrationScreen: FC = () => {
  const dispatch = useDispatch();

  const registerUsername = (name: string) => {
    dispatch(identityActions.registerUsername(name));
  };

  return <Registration registerUsernameAction={registerUsername} />;
};
