import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  BorderRadius,
  BottomTabInset,
  FontSize,
  FontWeight,
  Fonts,
  MaxContentWidth,
  Palette,
  Spacing,
} from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { BellIcon, CopyIcon, GiftIcon } from '@/components/icons';
import { BalanceCard } from '@/components/home/balance-card';
import { QuickActionsGrid } from '@/components/home/quick-actions-grid';
import { RecentTransactionsCard, TransactionItem } from '@/components/home/recent-transactions-card';
import { formatRupiah } from '@/utils/currency';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const theme = useTheme();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  if (!isAuthenticated && !isAuthLoading) {
    return null;
  }

  const accountNumber = '1234 5678 9012';

  const handleCopyAccount = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show('Nomor rekening disalin!', ToastAndroid.SHORT);
    } else {
      Alert.alert('Tersalin', 'Nomor rekening telah disalin ke clipboard.');
    }
  };

  const recentTransactions: TransactionItem[] = [
    {
      id: '1',
      title: 'Transfer ke Budi Santoso',
      description: 'Transfer',
      date: '11 Sep 2026, 14:30',
      amount: formatRupiah(-150000),
      type: 'expense',
    },
    {
      id: '2',
      title: 'Cashback Promo Kado',
      description: 'Reward',
      date: '10 Sep 2026, 09:15',
      amount: formatRupiah(25000, { showSign: true }),
      type: 'income',
    },
    {
      id: '3',
      title: 'Top Up Saldo E-Wallet',
      description: 'Top Up',
      date: '10 Sep 2026, 08:00',
      amount: formatRupiah(-50000),
      type: 'expense',
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* ─── 1. TOP APP BAR / HEADER ──────────────────────── */}
          <View style={styles.headerContainer}>
            {/* User Profile Info */}
            <Pressable
              style={({ pressed }) => [styles.profileSection, pressed && styles.pressed]}
              onPress={() => router.push('/profile')}>
              {user?.avatar_url ? (
                <Image
                  source={{ uri: user.avatar_url }}
                  style={styles.avatarImage}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <View style={styles.avatar}>
                  <ThemedText style={styles.avatarText}>
                    {user?.name ? user.name.slice(0, 2).toUpperCase() : 'NA'}
                  </ThemedText>
                </View>
              )}
              <View style={styles.profileTextContainer}>
                <ThemedText style={styles.userName}>{user?.name || 'Nova Ardiansyah'}</ThemedText>
                <Pressable
                  onPress={handleCopyAccount}
                  style={({ pressed }) => [styles.accountRow, pressed && styles.pressed]}>
                  <ThemedText style={styles.accountNumber} themeColor="textSecondary">
                    {accountNumber}
                  </ThemedText>
                  <CopyIcon size={13} color={theme.textSecondary} />
                </Pressable>
              </View>
            </Pressable>

            {/* Action Icons */}
            <View style={styles.headerActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.circleActionBtn,
                  { borderColor: theme.backgroundSelected, backgroundColor: theme.backgroundElement },
                  pressed && styles.pressed,
                ]}>
                <GiftIcon size={18} color={theme.text} />
              </Pressable>

              <Pressable
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

          {/* ─── 2. KARTU SALDO UTAMA ─────────────────────────── */}
          <BalanceCard
            balance={788729}
            income={788729}
            expense={0}
            isVisible={isBalanceVisible}
            onToggleVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
            onHistoryPress={() => router.push('/transactions')}
          />

          {/* ─── 3. QUICK ACTIONS GRID ────────────────────────── */}
          <QuickActionsGrid
            onActionPress={(actionId) => {
              if (actionId === 'history') {
                router.push('/transactions');
              }
            }}
          />

          {/* ─── 4. RECENT ACTIVITY CARD ──────────────────────── */}
          <RecentTransactionsCard
            transactions={recentTransactions}
            onViewAll={() => router.push('/transactions')}
          />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: BottomTabInset + Spacing.two,
    gap: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.one,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  avatarText: {
    color: Palette.white,
    fontFamily: Fonts.sans,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  profileTextContainer: {
    gap: 2,
    flex: 1,
  },
  userName: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  accountNumber: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs + 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  circleActionBtn: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Palette.danger,
    borderRadius: BorderRadius.full,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Palette.card,
  },
  badgeText: {
    color: Palette.white,
    fontFamily: Fonts.sans,
    fontSize: 9,
    fontWeight: FontWeight.bold,
    lineHeight: 11,
  },
  pressed: {
    opacity: 0.7,
  },
});
