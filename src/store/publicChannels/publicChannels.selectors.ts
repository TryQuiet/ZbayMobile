import { Config } from 'react-native-config';
import { StoreKeys } from '../store.keys';
import { createSelector } from 'reselect';
import { selectReducer } from '../store.utils';
import {
  publicChannelMessagesIdsAdapter,
  publicChannelsAdapter,
} from './publicChannels.adapter';
import { formatMessageDisplayDate } from '../../utils/functions/formatMessageDisplayDate/formatMessageDisplayDate';

export const publicChannels = createSelector(
  selectReducer(StoreKeys.PublicChannels),
  reducerState => {
    return publicChannelsAdapter
      .getSelectors()
      .selectAll(reducerState.channels);
  },
);

export const ZbayChannel = createSelector(
  selectReducer(StoreKeys.PublicChannels),
  reducerState => {
    const publicChannelsList = publicChannelsAdapter
      .getSelectors()
      .selectAll(reducerState.channels);

    return publicChannelsList.find(
      channel => channel.address === Config.PUBLIC_CHANNEL_ADDRESS,
    );
  },
);

export const currentChannelMessagesIds = createSelector(
  selectReducer(StoreKeys.PublicChannels),
  reducerState => {
    return publicChannelMessagesIdsAdapter
      .getSelectors()
      .selectAll(reducerState.currentChannelMessagesIds);
  },
);

export const currentChannelMessages = createSelector(
  selectReducer(StoreKeys.PublicChannels),
  reducerState => reducerState.currentChannelMessages,
);

export const missingCurrentChannelMessages = createSelector(
  currentChannelMessagesIds,
  currentChannelMessages,
  (ids, messages) => {
    let missing: string[] = [];
    ids.forEach(id => {
      if (!(id in messages)) {
        missing.push(id);
      }
    });
    return missing;
  },
);

export const currentChannelDisplayableMessages = createSelector(
  currentChannelMessages,
  messages => {
    let displayable = [];
    for (const [id, message] of Object.entries(messages)) {
      displayable.push({
        id: id,
        message: message.message,
        nickname: 'anon',
        datetime: formatMessageDisplayDate(message.createdAt),
      });
    }
    return displayable;
  },
);

export const publicChannelsSelectors = {
  publicChannels,
  ZbayChannel,
  currentChannelMessagesIds,
  currentChannelMessages,
  missingCurrentChannelMessages,
  currentChannelDisplayableMessages,
};
