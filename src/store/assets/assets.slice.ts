import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { StoreKeys } from '../store.keys';

export class AssetsState {
  public currentWaggleVersion: string = '';
  public downloadProgress: number = 0;
}

export const assetsSlice = createSlice({
  initialState: { ...new AssetsState() },
  name: StoreKeys.Assets,
  reducers: {
    setCurrentWaggleVersion: (state, action: PayloadAction<string>) => {
      state.currentWaggleVersion = action.payload;
    },
    setProgress: (state, action: PayloadAction<number>) => {
      state.downloadProgress = action.payload;
    },
  },
});

export const assetsActions = assetsSlice.actions;
export const assetsReducer = assetsSlice.reducer;
