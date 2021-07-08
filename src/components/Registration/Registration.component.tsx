import React, { FC } from 'react';
import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView } from 'react-native';
import { Button } from '../Button/Button.component';
import { Input } from '../Input/Input.component';
import { Typography } from '../Typography/Typography.component';

import { RegistrationProps } from './Registration.types';

export const Registration: FC<RegistrationProps> = ({
  registerUsernameAction,
}) => {
  const [usernameInput, setUsernameInput] = useState<string | undefined>();
  const [inputError, setInputError] = useState<string | undefined>();

  const onChangeText = (value: string) => {
    setInputError(undefined);
    setUsernameInput(value);
  };

  const onPress = () => {
    Keyboard.dismiss();
    if (usernameInput === undefined || usernameInput?.length === 0) {
      setInputError('Username can not be empty');
      return;
    }
    registerUsernameAction(usernameInput);
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={{
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
      }}>
      <Typography
        fontSize={24}
        fontWeight={'medium'}
        style={{ marginBottom: 30 }}>
        {'Register a username'}
      </Typography>
      <Input
        onChangeText={onChangeText}
        label={'Choose your favorite username'}
        placeholder={'Enter a username'}
        hint={
          'Your username cannot have any spaces or special characters, must be lowercase letters and numbers only.'
        }
        validation={inputError}
      />
      <Button title={'Continue'} onPress={onPress} style={{ marginTop: 30 }} />
    </KeyboardAvoidingView>
  );
};
