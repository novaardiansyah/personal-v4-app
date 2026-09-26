import { StyleSheet } from 'react-native';
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Fonts,
  Palette,
  Spacing,
} from '@/constants/theme';

export const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: Spacing.three,
  },
  headerTitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
  },
  headerSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm + 1,
    marginTop: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    backgroundColor: Palette.card,
    padding: Spacing.three + 2,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  avatarText: {
    color: Palette.white,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  profileDesc: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
  },
  chevronWrapper: {
    paddingRight: 4,
  },
  menuCard: {
    marginTop: Spacing.three,
    borderRadius: BorderRadius.xl,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    gap: 12,
  },
  menuRowPressed: {
    backgroundColor: Palette.background,
  },
  menuIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    backgroundColor: Palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextContainer: {
    flex: 1,
    gap: 2,
  },
  menuTitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  menuSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs + 0.5,
    lineHeight: 15,
  },
  versionBadge: {
    backgroundColor: Palette.muted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm + 2,
  },
  versionBadgeText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Palette.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.muted,
    marginLeft: 62,
    marginRight: Spacing.three,
  },
  sectionContainer: {
    marginTop: Spacing.three,
  },
});
