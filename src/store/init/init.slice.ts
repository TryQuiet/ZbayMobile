import { createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';

import { StoreKeys } from '../store.keys';
import { initChecksAdapter } from './init.adapter';
import { InitCheck } from './init.types';

export class InitState {
  public initChecks: EntityState<InitCheck> =
    initChecksAdapter.getInitialState();
}

export const initSlice = createSlice({
  initialState: { ...new InitState() },
  name: StoreKeys.Init,
  reducers: {
    setStoreReady: state => {
      initChecksAdapter.setAll(state.initChecks, [
        {
          event: 'native services started',
          passed: false,
        },
        {
          event: 'tor initialized',
          passed: false,
        },
        {
          event: 'onion address added',
          passed: false,
        },
        {
          event: 'waggle started',
          passed: false,
        },
        {
          event: 'websocket connected',
          passed: false,
        },
      ]);
    },
    updateInitCheck: (state, action: PayloadAction<InitCheck>) => {
      initChecksAdapter.updateOne(state.initChecks, {
        changes: action.payload,
        id: action.payload.event,
      });
    },
  },
});

export const initActions = initSlice.actions;
export const initReducer = initSlice.reducer;
