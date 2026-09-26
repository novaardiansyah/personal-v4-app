import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { BellIcon, CopyIcon, GiftIcon } from '@/components/icons';
import { useTheme } from '@/hooks/use-theme';
import { styles } from './home.styles';

interface HomeHeaderProps {
  user: { name?: string; avatar_url?: string | null } | null;
  accountNumber: string;
  onProfilePress: () => void;
  onCopyAccount: () => void;
  onGiftPress?: () => void;
  onNotificationPress?: () => void;
}

export function HomeHeader({
  user,
  accountNumber,
  onProfilePress,
  onCopyAccount,
  onGiftPress,
  onNotificationPress,
}: HomeHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.headerContainer}>
      <Pressable
        style={({ pressed }) => [styles.profileSection, pressed && styles.pressed]}
        onPress={onProfilePress}>
        {user?.avatar_url ? (
          <Image
            source={{ uri: user.avatar_url }}
            style={styles.avatarImage}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'NA'}
            </Text>
          </View>
        )}
        <View style={styles.profileTextContainer}>
          <ThemedText style={styles.userName}>{user?.name || 'Nova Ardiansyah'}</ThemedText>
          <Pressable
            onPress={onCopyAccount}
            style={({ pressed }) => [styles.accountRow, pressed && styles.pressed]}>
            <ThemedText style={styles.accountNumber} themeColor="textSecondary">
              {accountNumber}
            </ThemedText>
            <CopyIcon size={13} color={theme.textSecondary} />
          </Pressable>
        </View>
      </Pressable>

      <View style={styles.headerActions}>
        <Pressable
          onPress={onGiftPress}
          style={({ pressed }) => [
            styles.circleActionBtn,
            { borderColor: theme.backgroundSelected, backgroundColor: theme.backgroundElement },
            pressed && styles.pressed,
          ]}>
          <GiftIcon size={18} color={theme.text} />
        </Pressable>

        <Pressable
          onPress={onNotificationPress}
          style={({ pressed }) => [
            styles.circleActionBtn,
            { borderColor: theme.backgroundSelected, backgroundColor: theme.backgroundElement },
            pressed && styles.pressed,
          ]}>
          <BellIcon size={18} color={theme.text} />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>15</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
