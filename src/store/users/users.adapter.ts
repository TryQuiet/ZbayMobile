import { createEntityAdapter } from '@reduxjs/toolkit';

export const certificatesAdapter = createEntityAdapter<string>({
  selectId: certificate => certificate,
});
