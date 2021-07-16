import React, { FC } from 'react';
import { Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { SidebarProps } from './Sidebar.types';

export const Sidebar: FC<SidebarProps> = ({ open }) => {
  const vw = Dimensions.get('window').width;
  const width = vw * 0.75;

  return (
    <LinearGradient
      colors={['#E42656', '#521576']}
      start={{ x: -0.6, y: 0.2 }}
      style={{
        width: width,
        marginStart: open ? 0 : -width,
      }}
    />
  );
};
