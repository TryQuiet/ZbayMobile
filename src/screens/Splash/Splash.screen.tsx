import React, { FC } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { Typography } from '../../components/Typography/Typography.component';
import { assetsSelectors } from '../../store/assets/assets.selectors';

export const SplashScreen: FC = () => {
  const progress = useSelector(assetsSelectors.downloadProgress);

  return (
    <View>
      {progress > 0 && (
        <Typography fontSize={14}>
          {'Download progress: ' + progress}
        </Typography>
      )}
    </View>
  );
};
