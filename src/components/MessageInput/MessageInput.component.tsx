import React, { useCallback, useRef, forwardRef } from 'react';
import { TextInput } from 'react-native';

import { StyledTextInput, StyledWrapper } from './MessageInput.styles';
import { MessageInputProps } from './MessageInput.types';

export const MessageInput = forwardRef<TextInput, MessageInputProps>(
  ({ placeholder }, ref) => {
    const textInputRef = useRef<null | TextInput>(null);

    const handleMessageViewPress = useCallback(() => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }, []);

    return (
      <StyledWrapper onPress={handleMessageViewPress}>
        <StyledTextInput
          multiline
          ref={(instance: TextInput | null) => {
            textInputRef.current = instance;
            if (ref !== null && 'current' in ref) {
              ref.current = instance;
            }
          }}
          placeholder={placeholder}
        />
      </StyledWrapper>
    );
  },
);
