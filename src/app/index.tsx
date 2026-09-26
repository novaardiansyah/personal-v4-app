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
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Colors, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { formatRupiah } from '@/utils/currency';

// --- Vector Icons ---
function CopyIcon({ size = 14, color = '#575757' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="9" y="9" width="13" height="13" rx="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function GiftIcon({ size = 20, color = '#242424' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 12v10H4V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M2 7h20v5H2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 22V7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BellIcon({ size = 20, color = '#242424' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function EyeIcon({ visible, size = 16, color = '#ffffff' }: { visible: boolean; size?: number; color?: string }) {
  if (visible) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M1 1l22 22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronRightIcon({ size = 12, color = '#ffffff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// Quick action menu icons
function SendMoneyIcon({ size = 20, color = '#E76006' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M22 2L11 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BillIcon({ size = 20, color = '#E76006' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M14 2v6h6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 13H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 17H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10 9H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function WalletIcon({ size = 20, color = '#E76006' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4 6v12a2 2 0 0 0 2 2h14v-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function QrIcon({ size = 20, color = '#E76006' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
      <Rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
      <Rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
      <Rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
      <Path d="M7 7h.01M17 7h.01M7 17h.01M17 17h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function CashIcon({ size = 20, color = '#E76006' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
      <Path d="M6 12h.01M18 12h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function HistoryIcon({ size = 20, color = '#E76006' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M14 2v6h6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 13h8M8 17h5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CardIcon({ size = 20, color = '#E76006' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M2 10h20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 15h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MoreGridIcon({ size = 20, color = '#E76006' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="6" cy="6" r="2.5" fill={color} />
      <Circle cx="18" cy="6" r="2.5" fill={color} />
      <Circle cx="6" cy="18" r="2.5" fill={color} />
      <Circle cx="18" cy="18" r="2.5" fill={color} />
    </Svg>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const theme = useTheme();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
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

  const quickActions = [
    { title: 'Transfer', icon: <SendMoneyIcon size={20} color={Colors.light.primary} /> },
    { title: 'Bayar & Beli', icon: <BillIcon size={20} color={Colors.light.primary} /> },
    { title: 'Top Up', icon: <WalletIcon size={20} color={Colors.light.primary} /> },
    { title: 'QRIS', icon: <QrIcon size={20} color={Colors.light.primary} /> },
    { title: 'Tarik Tunai', icon: <CashIcon size={20} color={Colors.light.primary} /> },
    { title: 'Mutasi', icon: <HistoryIcon size={20} color={Colors.light.primary} /> },
    { title: 'Virtual Acc.', icon: <CardIcon size={20} color={Colors.light.primary} /> },
    { title: 'Lainnya', icon: <MoreGridIcon size={20} color={Colors.light.primary} /> },
  ];

  const recentTransactions = [
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
          <View style={styles.balanceCardWrapper}>
            {/* Background Gradient */}
            <View style={styles.balanceCard}>
              <Svg
                style={StyleSheet.absoluteFill}
                width="100%"
                height="100%">
                <Defs>
                  <LinearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#E76006" stopOpacity="1" />
                    <Stop offset="1" stopColor="#F88911" stopOpacity="1" />
                  </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" rx={24} fill="url(#cardGrad)" />
              </Svg>

              {/* Top Row: Total Saldo & Riwayat Pill Button */}
              <View style={styles.cardTopRow}>
                <Pressable
                  onPress={() => setIsBalanceVisible(!isBalanceVisible)}
                  style={styles.totalSaldoRow}>
                  <Text style={styles.totalSaldoLabel}>Total Saldo</Text>
                  <EyeIcon visible={isBalanceVisible} size={16} color="#ffffff" />
                </Pressable>

                <Pressable
                  style={({ pressed }) => [styles.historyPill, pressed && styles.pressed]}>
                  <Text style={styles.historyPillText}>Riwayat</Text>
                  <ChevronRightIcon size={10} color="#ffffff" />
                </Pressable>
              </View>

              {/* Main Balance Display */}
              <View style={styles.mainBalanceSection}>
                <Text style={styles.mainBalanceText}>
                  {isBalanceVisible ? formatRupiah(788729) : '••••••••'}
                </Text>
              </View>

              {/* Divider */}
              <View style={styles.cardDivider} />

              {/* ─── 3. SUB-SECTION: PEMBAGIAN PRODUK KEUANGAN ──── */}
              <View style={styles.subSectionRow}>
                {/* Left Column: Pemasukan */}
                <View style={styles.subColLeft}>
                  <Pressable style={styles.subHeaderLink}>
                    <Text style={styles.subTitleText}>Pemasukan</Text>
                    <ChevronRightIcon size={10} color="#ffffff" />
                  </Pressable>
                  <Text style={styles.subAmountText}>
                    {isBalanceVisible ? formatRupiah(788729) : '••••••'}
                  </Text>
                </View>

                {/* Vertical Divider */}
                <View style={styles.subColDivider} />

                {/* Right Column: Pengeluaran */}
                <View style={styles.subColRight}>
                  <Pressable style={styles.subHeaderLink}>
                    <Text style={styles.subTitleText}>Pengeluaran</Text>
                    <ChevronRightIcon size={10} color="#ffffff" />
                  </Pressable>
                  <Text style={styles.subAmountText}>
                    {isBalanceVisible ? formatRupiah(0) : '••••••'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ─── 4. QUICK ACTIONS GRID ────────────────────────── */}
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [styles.quickActionItem, pressed && styles.pressed]}>
                <View style={styles.quickActionIconWrapper}>
                  {action.icon}
                </View>
                <ThemedText style={styles.quickActionText}>{action.title}</ThemedText>
              </Pressable>
            ))}
          </View>

          {/* ─── 5. RECENT ACTIVITY CARD (CARD KETIGA) ───────── */}
          <View style={styles.transactionListCard}>
            {/* Card Header inside Card with Chevron > */}
            <Pressable
              style={({ pressed }) => [styles.activityCardHeader, pressed && styles.pressed]}>
              <ThemedText style={styles.activityCardTitle}>Aktivitas Terkini</ThemedText>
              <ChevronRightIcon size={14} color={theme.textSecondary} />
            </Pressable>

            <View
              style={[
                styles.transactionDivider,
                { backgroundColor: theme.backgroundSelected },
              ]}
            />

            {/* Transaction Items */}
            {recentTransactions.map((tx, idx) => (
              <View key={tx.id}>
                <View style={styles.transactionRow}>
                  <View style={styles.txLeft}>
                    <View style={styles.txHeaderGroup}>
                      <ThemedText style={styles.txTitle}>{tx.title}</ThemedText>
                      <ThemedText style={styles.txSubtitle} themeColor="textSecondary">
                        {tx.description}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.txDate} themeColor="textSecondary">
                      {tx.date}
                    </ThemedText>
                  </View>
                  <View style={styles.txRight}>
                    <Text
                      style={[
                        styles.txAmount,
                        {
                          color:
                            tx.type === 'income' ? '#22C55E' : theme.text,
                        },
                      ]}>
                      {tx.amount}
                    </Text>
                  </View>
                </View>
                {idx < recentTransactions.length - 1 && (
                  <View
                    style={[
                      styles.transactionDivider,
                      { backgroundColor: theme.backgroundSelected },
                    ]}
                  />
                )}
              </View>
            ))}

            {/* Card Footer inside Card */}
            <View
              style={[
                styles.transactionDivider,
                { backgroundColor: theme.backgroundSelected },
              ]}
            />
            <Pressable
              style={({ pressed }) => [styles.activityCardFooter, pressed && styles.pressed]}>
              <ThemedText style={styles.footerText} themeColor="primary">
                Lihat Selengkapnya
              </ThemedText>
            </Pressable>
          </View>
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
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  pressed: {
    opacity: 0.75,
  },

  /* ── Header ────────────────────────────────────────────── */
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
    paddingHorizontal: Spacing.one,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E76006',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E76006',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  profileTextContainer: {
    gap: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  accountNumber: {
    fontSize: 12,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  circleActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#E76006',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },

  /* ── Balance Card ──────────────────────────────────────── */
  balanceCardWrapper: {
    marginBottom: Spacing.four,
    borderRadius: 16,
    backgroundColor: '#E76006',
    ...Platform.select({
      ios: {
        shadowColor: '#E76006',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 2px 8px rgba(231, 96, 6, 0.08)',
      },
    }),
  },
  balanceCard: {
    borderRadius: 16,
    padding: Spacing.three + 2,
    overflow: 'hidden',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalSaldoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  totalSaldoLabel: {
    fontFamily: Fonts.sans,
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.95,
  },
  historyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  historyPillText: {
    fontFamily: Fonts.sans,
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  mainBalanceSection: {
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  mainBalanceText: {
    fontFamily: Fonts.sans,
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    marginVertical: Spacing.two,
  },

  /* ── Sub Sections ──────────────────────────────────────── */
  subSectionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  subColLeft: {
    flex: 1,
    paddingRight: Spacing.two,
  },
  subColDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  subColRight: {
    flex: 1.1,
    paddingLeft: Spacing.two,
  },
  subHeaderLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 2,
  },
  subTitleText: {
    fontFamily: Fonts.sans,
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  subAmountText: {
    fontFamily: Fonts.sans,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginVertical: 2,
    fontVariant: ['tabular-nums'],
  },

  /* ── Quick Actions (Card Kedua) ────────────────────────── */
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingVertical: Spacing.two + 4,
    paddingHorizontal: Spacing.one,
    borderRadius: 14,
    marginBottom: Spacing.four,
    borderWidth: 1,
    borderColor: '#ECEEF2',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.005,
        shadowRadius: 2,
      },
      android: {
        elevation: 0,
      },
      web: {
        boxShadow: 'none',
      },
    }),
  },
  quickActionItem: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: Spacing.two,
    gap: 6,
  },
  quickActionIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF7F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontFamily: Fonts.sans,
    fontSize: 11.5,
    fontWeight: '600',
    color: '#242424',
    textAlign: 'center',
    lineHeight: 14,
  },

  /* ── Recent Activity (Card Ketiga) ─────────────────────── */
  transactionListCard: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    borderColor: '#ECEEF2',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.005,
        shadowRadius: 2,
      },
      android: {
        elevation: 0,
      },
      web: {
        boxShadow: 'none',
      },
    }),
  },
  activityCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.three - 2,
  },
  activityCardTitle: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  txLeft: {
    gap: 8,
  },
  txHeaderGroup: {
    gap: 1,
  },
  txTitle: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
  },
  txSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 11.5,
    lineHeight: 14,
  },
  txDate: {
    fontFamily: Fonts.sans,
    fontSize: 10.5,
    lineHeight: 13,
    opacity: 0.85,
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  txAmount: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  transactionDivider: {
    height: 1,
    backgroundColor: '#F0F1F5',
  },
  activityCardFooter: {
    paddingVertical: Spacing.three - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
});

