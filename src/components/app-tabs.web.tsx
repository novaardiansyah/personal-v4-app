import { usePathname } from 'expo-router';
import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { ThemedText } from './themed-text';
import { Colors, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';

function HomeTabIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9.5L12 2.5L21 9.5V20.5C21 21.0523 20.5523 21.5 20 21.5H4C3.44772 21.5 3 21.0523 3 20.5V9.5Z"
        stroke={color}
        strokeWidth={focused ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={focused ? 'rgba(231, 96, 6, 0.12)' : 'none'}
      />
      <Path
        d="M9 21.5V12H15V21.5"
        stroke={color}
        strokeWidth={focused ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function BudgetTabIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21.21 15.89A10 10 0 1 1 8 2.83"
        stroke={color}
        strokeWidth={focused ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 12A10 10 0 0 0 12 2V12H22Z"
        stroke={color}
        strokeWidth={focused ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={focused ? 'rgba(231, 96, 6, 0.15)' : 'none'}
      />
    </Svg>
  );
}

function TransactionsTabIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 3L21 7L17 11"
        stroke={color}
        strokeWidth={focused ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 7H21"
        stroke={color}
        strokeWidth={focused ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 21L3 17L7 13"
        stroke={color}
        strokeWidth={focused ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 17H3"
        stroke={color}
        strokeWidth={focused ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function GoalsTabIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth={focused ? 2.2 : 1.8}
      />
      <Circle
        cx="12"
        cy="12"
        r="5"
        stroke={color}
        strokeWidth={focused ? 2.2 : 1.8}
        fill={focused ? 'rgba(231, 96, 6, 0.15)' : 'none'}
      />
      <Circle
        cx="12"
        cy="12"
        r="1.5"
        fill={color}
      />
    </Svg>
  );
}

function ProfileTabIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
        stroke={color}
        strokeWidth={focused ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="12"
        cy="7"
        r="4"
        stroke={color}
        strokeWidth={focused ? 2.2 : 1.8}
        fill={focused ? 'rgba(231, 96, 6, 0.15)' : 'none'}
      />
    </Svg>
  );
}

export default function AppTabs() {
  const pathname = usePathname();
  const hideTabBar = pathname === '/login' || pathname === '/register' || pathname === '/edit-profile';

  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      {!hideTabBar && (
        <TabList asChild>
          <CustomTabList>
            <TabTrigger name="home" href="/" asChild>
              <TabButton icon={(c, f) => <HomeTabIcon color={c} focused={f} />}>Beranda</TabButton>
            </TabTrigger>
            <TabTrigger name="budget" href="/budget" asChild>
              <TabButton icon={(c, f) => <BudgetTabIcon color={c} focused={f} />}>Anggaran</TabButton>
            </TabTrigger>
            <TabTrigger name="transactions" href="/transactions" asChild>
              <TabButton icon={(c, f) => <TransactionsTabIcon color={c} focused={f} />}>Transaksi</TabButton>
            </TabTrigger>
            <TabTrigger name="goals" href="/goals" asChild>
              <TabButton icon={(c, f) => <GoalsTabIcon color={c} focused={f} />}>Tujuan</TabButton>
            </TabTrigger>
            <TabTrigger name="profile" href="/profile" asChild>
              <TabButton icon={(c, f) => <ProfileTabIcon color={c} focused={f} />}>Profile</TabButton>
            </TabTrigger>
          </CustomTabList>
        </TabList>
      )}
    </Tabs>
  );
}

export function TabButton({
  children,
  isFocused,
  icon,
  ...props
}: TabTriggerSlotProps & {
  icon?: (color: string, isFocused: boolean) => React.ReactNode;
}) {
  const activeColor = Colors.light.primary;
  const inactiveColor = Colors.light.secondary;
  const currentColor = isFocused ? activeColor : inactiveColor;

  return (
    <Pressable {...props} style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      {icon && icon(currentColor, !!isFocused)}
      <ThemedText
        style={[
          styles.tabButtonText,
          {
            color: currentColor,
            fontWeight: isFocused ? '700' : '500',
          },
        ]}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <View style={styles.innerContainer}>
        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECEEF2',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.03)',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingVertical: Spacing.two,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: Spacing.two,
  },
  tabButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 10.5,
  },
  pressed: {
    opacity: 0.7,
  },
});
