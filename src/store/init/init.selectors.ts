import { createSelector } from 'reselect';
import { StoreKeys } from '../store.keys';
import { StoreState } from '../store.types';
import { selectReducer } from '../store.utils';
import { initChecksAdapter } from './init.adapter';

export const dataDirectoryPath = createSelector(
  selectReducer(StoreKeys.Init),
  (reducerState: StoreState[StoreKeys.Init]) => reducerState.dataDirectoryPath,
);

export const hiddenServiceAddress = createSelector(
  selectReducer(StoreKeys.Init),
  (reducerState: StoreState[StoreKeys.Init]) => reducerState.hiddenServiceAddress,
);

export const isNavigatorReady = createSelector(
  selectReducer(StoreKeys.Init),
  (reducerState: StoreState[StoreKeys.Init]) => reducerState.isNavigatorReady,
);

export const isCryptoEngineInitialized = createSelector(
  selectReducer(StoreKeys.Init),
  (reducerState: StoreState[StoreKeys.Init]) =>
    reducerState.isCryptoEngineInitialized,
);

export const initDescription = createSelector(
  selectReducer(StoreKeys.Init),
  (reducerState: StoreState[StoreKeys.Init]) => reducerState.initDescription,
);

export const initChecks = createSelector(
  selectReducer(StoreKeys.Init),
  (reducerState: StoreState[StoreKeys.Init]) =>
    initChecksAdapter.getSelectors().selectAll(reducerState.initChecks),
);

export const currentScreen = createSelector(
  selectReducer(StoreKeys.Init),
  (reducerState: StoreState[StoreKeys.Init]) => reducerState.currentScreen,
);

export const initSelectors = {
  dataDirectoryPath,
  hiddenServiceAddress,
  isNavigatorReady,
  isCryptoEngineInitialized,
  initDescription,
  initChecks,
  currentScreen,
};
