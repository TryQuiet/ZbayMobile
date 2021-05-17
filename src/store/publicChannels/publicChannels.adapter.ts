import {createEntityAdapter} from '@reduxjs/toolkit';
import {IPublicChannelMessage, IPublicChannel} from './publicChannels.types';

export const publicChannelMessagesAdapter =
  createEntityAdapter<IPublicChannelMessage>();

export const publicChannelsAdapter = createEntityAdapter<IPublicChannel>();
