import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {publicChannelsSelectors} from '../../store/publicChannels/publicChannels.selectors';
import {publicChannelsActions} from '../../store/publicChannels/publicChannels.slice';

export const SplashScreen: React.FC = () => {
  const channels = useSelector(publicChannelsSelectors.publicChannels);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(publicChannelsActions.getPublicChannels);
  }, [dispatch]);
  return (
    <View>
      {channels.map(channel => (
        <Text>{channel.name}</Text>
      ))}
    </View>
  );
};
