import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { StoreKeys } from '../store.keys';

export class AssetsState {
  public currentWaggleVersion: string = '';
  public currentLibsVersion: string = '';
  public downloadProgress: number = 0;
  public downloadError: string = '';
}

export const assetsSlice = createSlice({
  initialState: { ...new AssetsState() },
  name: StoreKeys.Assets,
  reducers: {
    setCurrentWaggleVersion: (state, action: PayloadAction<string>) => {
      state.currentWaggleVersion = action.payload;
    },
    setCurrentLibsVersion: (state, action: PayloadAction<string>) => {
      state.currentLibsVersion = action.payload;
    },
    setDownloadProgress: (state, action: PayloadAction<number>) => {
      state.downloadProgress = action.payload;
    },
    throwDownloadError: (state, action: PayloadAction<string>) => {
      state.downloadError = action.payload;
    },
    throwDownloadCompleted: state => state,
  },
});

export const assetsActions = assetsSlice.actions;
export const assetsReducer = assetsSlice.reducer;
