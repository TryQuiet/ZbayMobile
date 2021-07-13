/* eslint-disable prettier/prettier */
import { createSelector } from '@reduxjs/toolkit';
import {
  getCertFieldValue,
  keyFromCertificate,
  loadCertificate,
  parseCertificate,
} from '@zbayapp/identity/lib';
import Certificate from 'pkijs/src/Certificate';
import { CertFieldsTypes } from '@zbayapp/identity/lib/common';
import { StoreKeys } from '../store.keys';
import { selectReducer } from '../store.utils';
import { certificatesAdapter } from './users.adapter';
import { User } from './users.slice';

export const certificates = createSelector(
  selectReducer(StoreKeys.Users),
  reducerState => {
    return certificatesAdapter
      .getSelectors()
      .selectAll(reducerState.certificates);
  },
);

export const certificatesMapping = createSelector(
  certificates,
  certificates => {
    return certificates.reduce<{ [publicKey: string]: User }>(
      (accumulator, current) => {
        let key: string = '';
        let certificate: Certificate;

        let username: string = '';
        let onionAddress: string = '';
        let peerId: string = '';

        if (current && current !== null) {
          const parsed = parseCertificate(current);
          key = keyFromCertificate(parsed);
          certificate = loadCertificate(current);

          if (certificate.subject.typesAndValues.length === 3) {
            username = getCertFieldValue(
              certificate,
              CertFieldsTypes.nickName
            );
            onionAddress = getCertFieldValue(
              certificate,
              CertFieldsTypes.commonName,
            );
            peerId = getCertFieldValue(
              certificate,
              CertFieldsTypes.peerId
            );
          } else {
            return {};
          }
        }
        accumulator[key] = {
          username: username,
          onionAddress: onionAddress,
          peerId: peerId,
        };
        return accumulator;
      },
      {},
    );
  },
);

export const usersSelectors = {
  certificates,
  certificatesMapping,
};
