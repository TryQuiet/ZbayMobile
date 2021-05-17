import {StoreKeys} from './store.keys';
import {publicChannelsReducer} from './publicChannels/publicChannels.slice';
import {combineReducers} from '@reduxjs/toolkit';

export const rootReducer = combineReducers({
  [StoreKeys.PublicChannels]: publicChannelsReducer,
});
