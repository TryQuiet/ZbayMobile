import React, { FC } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Message } from '../Message/Message.component';
import { MessageInput } from '../MessageInput/MessageInput.component';

import { ChatProps } from './Chat.types';

export const Chat: FC<ChatProps> = ({ channel, messages, user }) => {
  return (
    <KeyboardAvoidingView
      behavior="height"
      keyboardVerticalOffset={55}
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
      <FlatList
        inverted
        data={messages}
        keyExtractor={item => item.message.message.id}
        renderItem={({ item }) => <Message message={item} />}
        style={{ paddingLeft: 20, paddingRight: 20 }}
      />
      <MessageInput
        placeholder={'Message #' + channel.name + ' as @' + user}
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
        }}
      />
    </KeyboardAvoidingView>
  );
};
