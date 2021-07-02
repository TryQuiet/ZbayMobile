import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { StoreKeys } from '../store.keys';

import { KeyObject } from 'crypto';

export class IdentityState {
  public zbayNickname: string = '';
  public commonName: string = '';
  public peerId: string = '';
  public userCsr: UserCsr | null = null;
}

export interface UserCsr {
  userCsr: string;
  userKey: string;
  pkcs10: CertData;
}

interface CertData {
  publicKey: KeyObject;
  privateKey: KeyObject;
  pkcs10: any;
}

export interface CreateUserCsrPayload {
  zbayNickname: string;
  commonName: string;
  peerId: string;
}

export const identitySlice = createSlice({
  initialState: { ...new IdentityState() },
  name: StoreKeys.Identity,
  reducers: {
    storeCommonName: (state, action: PayloadAction<string>) => {
      state.commonName = action.payload;
    },
    requestPeerId: state => state,
    storePeerId: (state, action: PayloadAction<string>) => {
      state.peerId = action.payload;
    },
    createUserCsr: (state, action: PayloadAction<CreateUserCsrPayload>) => {
      // Store nickname in this step as it won't be returned by waggle after being saved to db
      state.zbayNickname = action.payload.zbayNickname;
    },
    storeUserCsr: (state, action: PayloadAction<UserCsr>) => {
      state.userCsr = action.payload;
    },
  },
});

export const identityActions = identitySlice.actions;
export const identityReducer = identitySlice.reducer;
