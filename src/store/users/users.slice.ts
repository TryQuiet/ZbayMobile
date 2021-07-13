import { createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import { StoreKeys } from '../store.keys';
import { certificatesAdapter } from './users.adapter';

export class UsersState {
  public certificates: EntityState<string> =
    certificatesAdapter.getInitialState();
}

export interface User {
  username: string;
  onionAddress: string;
  peerId: string;
}

export const usersSlice = createSlice({
  initialState: { ...new UsersState() },
  name: StoreKeys.Users,
  reducers: {
    responseSendCertificates: (state, action: PayloadAction<string[]>) => {
      certificatesAdapter.setAll(state.certificates, action.payload);
    },
  },
});
export const usersActions = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
