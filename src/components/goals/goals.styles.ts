import { StyleSheet } from 'react-native';
import { BottomTabInset, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
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
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  headerContainer: {
    marginBottom: Spacing.three,
  },
  headerTitle: {
    fontFamily: Fonts.sans,
    fontSize: 22,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: '#ECEEF2',
    gap: 8,
  },
  cardTitle: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  cardDesc: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 16,
  },
});
