import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AppStackParamList } from '../AppStackNavigation';
import { HeaderScreenBase } from '../HeaderScreenBase';
import { UserAvatar } from '../Avatar/UserAvatar';
import { IconButton } from '../IconButton';

export const HomeHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0,
    marginBottom: 16,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

type HomeHeaderNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Account'
>;

export const HomeHeader = () => {
  const navigation = useNavigation<HomeHeaderNavigationProp>();

  const onAvatarPress = () => {
    navigation.navigate('Account');
  };

  const handleNotificationsPress = () => {
    navigation.navigate('Notifications');
  };

  return (
    <HeaderScreenBase>
      <TouchableOpacity onPress={onAvatarPress}>
        <UserAvatar />
      </TouchableOpacity>
      <IconButton
        onPress={handleNotificationsPress}
        icon={<Bell size={24} color="#ffffff" strokeWidth={1} />}
      />
    </HeaderScreenBase>
  );
};
