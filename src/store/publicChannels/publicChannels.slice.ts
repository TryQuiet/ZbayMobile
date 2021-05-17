import {createSlice, EntityState, PayloadAction} from '@reduxjs/toolkit';

import {StoreKeys} from '../store.keys';

import {
  publicChannelMessagesAdapter,
  publicChannelsAdapter,
} from './publicChannels.adapter';
import {IPublicChannelMessage, IPublicChannel} from './publicChannels.types';

export const initialPublicChannelsSliceState: {
  currentChannelId: string;
  channels: EntityState<IPublicChannel>;
  messages: {[channelAddress: string]: EntityState<IPublicChannelMessage>};
} = {
  currentChannelId: '',
  channels: publicChannelsAdapter.getInitialState(),
  messages: {},
};

export const publicChannelsSlice = createSlice({
  initialState: initialPublicChannelsSliceState,
  name: StoreKeys.PublicChannels,
  reducers: {
    loadAllMessages: (
      state,
      _action: PayloadAction<{
        channelAdress: string;
      }>,
    ) => state,
    responseLoadAllMessages: (
      state,
      action: PayloadAction<{
        channelAddress: string;
        messages: IPublicChannelMessage[];
      }>,
    ) => {
      if (state.messages[action.payload.channelAddress]) {
        state.messages[action.payload.channelAddress] =
          publicChannelMessagesAdapter.getInitialState();
      }
      publicChannelMessagesAdapter.setAll(
        state.messages[action.payload.channelAddress],
        action.payload.messages,
      );
    },
    getPublicChannels: (
      state,
      _action: PayloadAction<{
        channels: IPublicChannel[];
      }>,
    ) => state,
    responseGetPublicChannels: (
      state,
      action: PayloadAction<{
        channels: IPublicChannel[];
      }>,
    ) => {
      publicChannelsAdapter.setAll(state.channels, action.payload.channels);
    },
  },
});

export const publicChannelsActions = publicChannelsSlice.actions;
export const publicChannelsReducer = publicChannelsSlice.reducer;
