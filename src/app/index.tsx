import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/auth-context';
import { BalanceCard } from '@/components/home/balance-card';
import { QuickActionsGrid } from '@/components/home/quick-actions-grid';
import { RecentTransactionsCard, TransactionItem } from '@/components/home/recent-transactions-card';
import { HomeHeader } from '@/components/home/home-header';
import { styles } from '@/components/home/home.styles';
import { formatRupiah } from '@/utils/currency';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
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
          <HomeHeader
            user={user}
            accountNumber={accountNumber}
            onProfilePress={() => router.push('/profile')}
            onCopyAccount={handleCopyAccount}
          />

          <BalanceCard
            balance={788729}
            income={788729}
            expense={0}
            isVisible={isBalanceVisible}
            onToggleVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
            onHistoryPress={() => router.push('/transactions')}
          />

          <QuickActionsGrid
            onActionPress={(actionId) => {
              if (actionId === 'history') {
                router.push('/transactions');
              }
            }}
          />

          <RecentTransactionsCard
            transactions={recentTransactions}
            onViewAll={() => router.push('/transactions')}
          />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
