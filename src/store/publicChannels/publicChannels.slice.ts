import { createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';

import { StoreKeys } from '../store.keys';

import {
  publicChannelMessagesIdsAdapter,
  publicChannelsAdapter,
} from './publicChannels.adapter';
import { IChannelInfo, IMessage } from './publicChannels.types';

export class PublicChannelsState {
  public channels: EntityState<IChannelInfo> =
    publicChannelsAdapter.getInitialState();

  public currentChannelMessagesIds: EntityState<string> =
    publicChannelMessagesIdsAdapter.getInitialState();

  public currentChannelMessages: ChannelMessages = {};
}

export interface GetPublicChannelsResponse {
  [name: string]: IChannelInfo;
}

export interface ChannelMessages {
  [id: string]: IMessage;
}

export interface ChannelMessagesIdsResponse {
  channelAddress: string;
  ids: string[];
}

export interface AskForMessagesPayload {
  channelAddress: string;
  ids: string[];
}

export interface AskForMessagesResponse {
  channelAddress: string;
  messages: IMessage[];
}

export const publicChannelsSlice = createSlice({
  initialState: { ...new PublicChannelsState() },
  name: StoreKeys.PublicChannels,
  reducers: {
    getPublicChannels: state => state,
    responseGetPublicChannels: (
      state,
      action: PayloadAction<GetPublicChannelsResponse>,
    ) => {
      publicChannelsAdapter.setAll(
        state.channels,
        Object.values(action.payload),
      );
    },
    subscribeForTopic: (state, _action: PayloadAction<IChannelInfo>) => state,
    responseSendIds: (
      state,
      action: PayloadAction<ChannelMessagesIdsResponse>,
    ) => {
      publicChannelMessagesIdsAdapter.setAll(
        state.currentChannelMessagesIds,
        Object.values(action.payload),
      );
    },
    askForMessages: (state, _action: PayloadAction<AskForMessagesPayload>) =>
      state,
    responseAskForMessages: (
      state,
      action: PayloadAction<AskForMessagesResponse>,
    ) => {
      action.payload.messages.forEach(message => {
        state.currentChannelMessages[message.id] = message;
      });
    },
  },
});

export const publicChannelsActions = publicChannelsSlice.actions;
export const publicChannelsReducer = publicChannelsSlice.reducer;
