import {createSlice} from '@reduxjs/toolkit';

import {StoreKeys} from '../store.keys';

export const initialsocketSliceState = {};
export const socketSlice = createSlice({
  initialState: initialsocketSliceState,
  name: StoreKeys.Socket,
  reducers: {
    connectToWebsocketServer: state => state,
  },
});

export const socketActions = socketSlice.actions;
export const socketReducer = socketSlice.reducer;
