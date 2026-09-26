import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  BorderRadius,
  CommonStyles,
  FontSize,
  FontWeight,
  Fonts,
  Palette,
  Spacing,
} from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import {
  changePasswordMobileApi,
  getProfileMobileApi,
  updateProfileMobileApi,
} from '@/services/api';
import { pickImageFromCamera, pickImageFromGallery } from '@/utils/image-picker';
import {
  ArrowLeftIcon,
  CameraIcon,
  KeyIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from '@/components/icons';
import { AvatarPickerModal } from '@/components/profile/avatar-picker-modal';
import { PasswordInput } from '@/components/auth/password-input';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser, isAuthenticated } = useAuth();
  const navigateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar_url || null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{ name?: string }>({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{
    current_password?: string;
    new_password?: string;
    new_password_confirmation?: string;
  }>({});
  const [passwordGeneralError, setPasswordGeneralError] = useState('');
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      setGeneralError('');
      setSuccessMessage('');
      setPasswordGeneralError('');
      setPasswordSuccessMessage('');
      setFieldErrors({});
      setPasswordErrors({});

      return () => {
        if (navigateTimeoutRef.current) {
          clearTimeout(navigateTimeoutRef.current);
          navigateTimeoutRef.current = null;
        }
        setGeneralError('');
        setSuccessMessage('');
        setPasswordGeneralError('');
        setPasswordSuccessMessage('');
        setFieldErrors({});
        setPasswordErrors({});
      };
    }, [])
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (user?.token) {
      setIsFetching(true);
      getProfileMobileApi(user.token)
        .then((res) => {
          if (res.success && res.data?.user) {
            const u = res.data.user;
            setName(u.name || '');
            setEmail(u.email || '');
            if (u.avatar_url) {
              setAvatarPreview(u.avatar_url);
            }
            updateUser({
              name: u.name,
              email: u.email,
              avatar_url: u.avatar_url,
            });
          }
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
  }, [isAuthenticated, user?.token]);

  const handlePickGallery = async () => {
    setIsAvatarModalVisible(false);
    try {
      const res = await pickImageFromGallery();
      if (!res.canceled && res.base64) {
        setAvatarPreview(res.uri || res.base64);
        setAvatarBase64(res.base64);
      }
    } catch {
      setGeneralError('Gagal memilih gambar dari galeri. Silakan coba lagi.');
    }
  };

  const handlePickCamera = async () => {
    setIsAvatarModalVisible(false);
    try {
      const res = await pickImageFromCamera();
      if (!res.canceled && res.base64) {
        setAvatarPreview(res.uri || res.base64);
        setAvatarBase64(res.base64);
      }
    } catch {
      setGeneralError('Gagal mengambil foto dari kamera. Pastikan izin kamera telah diberikan.');
    }
  };

  const handleRemoveAvatar = () => {
    setIsAvatarModalVisible(false);
    setAvatarPreview(null);
    setAvatarBase64(null);
  };

  const handleBack = () => {
    if (navigateTimeoutRef.current) {
      clearTimeout(navigateTimeoutRef.current);
      navigateTimeoutRef.current = null;
    }
    setGeneralError('');
    setSuccessMessage('');
    setPasswordGeneralError('');
    setPasswordSuccessMessage('');
    setFieldErrors({});
    setPasswordErrors({});
    router.replace('/profile');
  };

  const handleSave = async () => {
    setGeneralError('');
    setSuccessMessage('');
    const clientErrors: { name?: string } = {};

    if (!name.trim()) {
      clientErrors.name = 'Nama lengkap wajib diisi.';
    }

    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      const payload: {
        name: string;
        avatar_base64?: string | null;
        avatar_url?: string | null;
      } = {
        name: name.trim(),
      };

      if (avatarBase64) {
        payload.avatar_base64 = avatarBase64;
      } else if (avatarPreview === null) {
        payload.avatar_url = '';
      }

      const res = await updateProfileMobileApi(payload, user?.token);

      if (!res.success) {
        if (res.errors?.name?.[0]) {
          setFieldErrors((prev) => ({ ...prev, name: res.errors?.name?.[0] }));
        }
        setGeneralError(res.message || 'Gagal memperbarui profil.');
        return;
      }

      if (res.data?.user) {
        await updateUser({
          name: res.data.user.name,
          email: res.data.user.email,
          avatar_url: res.data.user.avatar_url,
        });
      }

      setSuccessMessage('Profil Anda berhasil diperbarui!');

      if (navigateTimeoutRef.current) {
        clearTimeout(navigateTimeoutRef.current);
      }

      navigateTimeoutRef.current = setTimeout(() => {
        setSuccessMessage('');
        router.replace('/profile');
      }, 800);
    } catch {
      setGeneralError('Terjadi kesalahan jaringan saat menyimpan data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordGeneralError('');
    setPasswordSuccessMessage('');
    const errors: {
      current_password?: string;
      new_password?: string;
      new_password_confirmation?: string;
    } = {};

    if (!currentPassword) {
      errors.current_password = 'Kata sandi saat ini wajib diisi.';
    }

    if (!newPassword) {
      errors.new_password = 'Kata sandi baru wajib diisi.';
    } else if (newPassword.length < 6) {
      errors.new_password = 'Kata sandi baru minimal 6 karakter.';
    }

    if (!confirmPassword) {
      errors.new_password_confirmation = 'Konfirmasi kata sandi baru wajib diisi.';
    } else if (newPassword !== confirmPassword) {
      errors.new_password_confirmation = 'Konfirmasi kata sandi tidak cocok.';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors({});
    setIsChangingPassword(true);

    try {
      const res = await changePasswordMobileApi(
        {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        },
        user?.token
      );

      if (!res.success) {
        if (res.errors?.current_password?.[0]) {
          setPasswordErrors((prev) => ({ ...prev, current_password: res.errors?.current_password?.[0] }));
        }
        if (res.errors?.new_password?.[0]) {
          setPasswordErrors((prev) => ({ ...prev, new_password: res.errors?.new_password?.[0] }));
        }
        if (res.errors?.new_password_confirmation?.[0]) {
          setPasswordErrors((prev) => ({ ...prev, new_password_confirmation: res.errors?.new_password_confirmation?.[0] }));
        }
        setPasswordGeneralError(res.message || 'Gagal mengubah kata sandi.');
        return;
      }

      if (res.data?.token) {
        await updateUser({
          token: res.data.token,
          name: res.data.user?.name,
          email: res.data.user?.email,
          avatar_url: res.data.user?.avatar_url,
          expires_at: res.data.expires_at,
        });
      }

      setPasswordSuccessMessage('Kata sandi berhasil diperbarui!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordGeneralError('Terjadi kesalahan jaringan saat mengubah kata sandi.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <ThemedView style={CommonStyles.screenContainer}>
      <SafeAreaView edges={['top', 'left', 'right']} style={CommonStyles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
          style={styles.keyboardAvoid}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={true}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            <View style={styles.topBar}>
              <Pressable
                style={({ pressed }) => [styles.backButton, pressed && CommonStyles.pressed]}
                onPress={handleBack}>
                <ArrowLeftIcon size={20} color={Palette.dark} />
              </Pressable>
              <ThemedText style={styles.topBarTitle}>Profile Saya</ThemedText>
              <View style={styles.placeholderButton} />
            </View>

            {generalError ? (
              <View style={styles.errorBanner}>
                <ThemedText style={styles.errorText}>{generalError}</ThemedText>
              </View>
            ) : null}

            {successMessage ? (
              <View style={styles.successBanner}>
                <ThemedText style={styles.successText}>{successMessage}</ThemedText>
              </View>
            ) : null}

            <View style={styles.avatarCard}>
              <Pressable
                style={({ pressed }) => [styles.avatarWrapper, pressed && CommonStyles.pressed]}
                onPress={() => setIsAvatarModalVisible(true)}>
                {avatarPreview ? (
                  <Image
                    source={{ uri: avatarPreview }}
                    style={styles.avatarImage}
                    contentFit="cover"
                    transition={200}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <ThemedText style={styles.avatarText}>
                      {name ? name.slice(0, 2).toUpperCase() : 'NA'}
                    </ThemedText>
                  </View>
                )}
                <View style={styles.cameraBadge}>
                  <CameraIcon size={16} color={Palette.white} />
                </View>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.changeAvatarBtn,
                  pressed && CommonStyles.pressed,
                ]}
                onPress={() => setIsAvatarModalVisible(true)}>
                <CameraIcon size={14} color={Palette.primary} />
                <ThemedText style={styles.changeAvatarBtnText}>Ubah Foto Profil</ThemedText>
              </Pressable>
            </View>

            <View style={styles.formCard}>
              <ThemedText style={styles.sectionTitle}>Data Pribadi</ThemedText>

              <View style={styles.inputGroup}>
                <ThemedText style={CommonStyles.inputLabel}>Nama Lengkap</ThemedText>
                <View
                  style={[
                    CommonStyles.inputContainer,
                    nameFocused && CommonStyles.inputContainerFocused,
                    Boolean(fieldErrors.name) && CommonStyles.inputContainerError,
                  ]}>
                  <View style={styles.inputIcon}>
                    <UserIcon color={fieldErrors.name ? Palette.danger : nameFocused ? Palette.primary : Palette.secondary} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Nama Lengkap"
                    placeholderTextColor={Palette.textMuted}
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                      if (generalError) setGeneralError('');
                    }}
                    autoCapitalize="words"
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                  />
                </View>
                {fieldErrors.name ? (
                  <ThemedText style={CommonStyles.fieldErrorText}>{fieldErrors.name}</ThemedText>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <ThemedText style={CommonStyles.inputLabel}>Alamat Email</ThemedText>
                  <ThemedText style={styles.disabledBadge}>Tidak dapat diubah</ThemedText>
                </View>
                <View style={[CommonStyles.inputContainer, styles.inputContainerDisabled]}>
                  <View style={styles.inputIcon}>
                    <MailIcon color={Palette.secondary} />
                  </View>
                  <TextInput
                    style={[styles.textInput, styles.textInputDisabled]}
                    value={email}
                    editable={false}
                    selectTextOnFocus={false}
                  />
                  <View style={styles.lockIconBadge}>
                    <LockIcon size={16} color={Palette.secondary} />
                  </View>
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [
                  CommonStyles.buttonPrimary,
                  styles.saveButton,
                  pressed && CommonStyles.buttonPrimaryPressed,
                  (isLoading || isFetching) && CommonStyles.buttonPrimaryDisabled,
                ]}
                onPress={handleSave}
                disabled={isLoading || isFetching}>
                {isLoading ? (
                  <ActivityIndicator color={Palette.white} size="small" />
                ) : (
                  <Text style={CommonStyles.buttonPrimaryText}>Simpan Perubahan</Text>
                )}
              </Pressable>
            </View>

            <View style={[styles.formCard, styles.passwordCard]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardHeaderIcon}>
                  <KeyIcon size={18} color={Palette.primary} />
                </View>
                <ThemedText style={styles.sectionTitle}>Ganti Kata Sandi</ThemedText>
              </View>

              {passwordGeneralError ? (
                <View style={styles.errorBanner}>
                  <ThemedText style={styles.errorText}>{passwordGeneralError}</ThemedText>
                </View>
              ) : null}

              {passwordSuccessMessage ? (
                <View style={styles.successBanner}>
                  <ThemedText style={styles.successText}>{passwordSuccessMessage}</ThemedText>
                </View>
              ) : null}

              <PasswordInput
                label="Kata Sandi Saat Ini"
                placeholder="Masukkan kata sandi saat ini"
                value={currentPassword}
                onChangeText={(text) => {
                  setCurrentPassword(text);
                  if (passwordErrors.current_password)
                    setPasswordErrors((prev) => ({ ...prev, current_password: undefined }));
                  if (passwordGeneralError) setPasswordGeneralError('');
                }}
                error={passwordErrors.current_password}
              />

              <PasswordInput
                label="Kata Sandi Baru"
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  if (passwordErrors.new_password)
                    setPasswordErrors((prev) => ({ ...prev, new_password: undefined }));
                  if (passwordGeneralError) setPasswordGeneralError('');
                }}
                error={passwordErrors.new_password}
              />

              <PasswordInput
                label="Konfirmasi Kata Sandi Baru"
                placeholder="Ulangi kata sandi baru"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (passwordErrors.new_password_confirmation)
                    setPasswordErrors((prev) => ({ ...prev, new_password_confirmation: undefined }));
                  if (passwordGeneralError) setPasswordGeneralError('');
                }}
                error={passwordErrors.new_password_confirmation}
              />

              <Pressable
                style={({ pressed }) => [
                  CommonStyles.buttonSecondary,
                  styles.passwordButton,
                  pressed && CommonStyles.pressed,
                  isChangingPassword && CommonStyles.buttonPrimaryDisabled,
                ]}
                onPress={handleChangePassword}
                disabled={isChangingPassword}>
                {isChangingPassword ? (
                  <ActivityIndicator color={Palette.white} size="small" />
                ) : (
                  <Text style={CommonStyles.buttonPrimaryText}>Perbarui Kata Sandi</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <AvatarPickerModal
          visible={isAvatarModalVisible}
          avatarPreview={avatarPreview}
          onClose={() => setIsAvatarModalVisible(false)}
          onPickCamera={handlePickCamera}
          onPickGallery={handlePickGallery}
          onRemoveAvatar={handleRemoveAvatar}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: 140,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.three,
    paddingVertical: Spacing.two,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Palette.dark,
  },
  placeholderButton: {
    width: 40,
  },
  errorBanner: {
    backgroundColor: Palette.dangerBg,
    borderColor: Palette.dangerBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: Spacing.three,
  },
  errorText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm + 1,
    color: Palette.dangerDark,
    fontWeight: FontWeight.medium,
  },
  successBanner: {
    backgroundColor: Palette.successBg,
    borderColor: Palette.successBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: Spacing.three,
  },
  successText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm + 1,
    color: Palette.successText,
    fontWeight: FontWeight.semibold,
  },
  avatarCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: Spacing.three,
    gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
    width: 90,
    height: 90,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Palette.border,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Palette.white,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Palette.primary,
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Palette.white,
  },
  changeAvatarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.primaryLight,
  },
  changeAvatarBtnText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs + 0.5,
    fontWeight: FontWeight.semibold,
    color: Palette.primary,
  },
  formCard: {
    backgroundColor: Palette.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: Spacing.three,
    gap: 14,
  },
  passwordCard: {
    marginTop: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Palette.dark,
  },
  inputGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabledBadge: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs,
    color: Palette.secondary,
    fontStyle: 'italic',
  },
  inputIcon: {
    marginRight: 10,
  },
  inputContainerDisabled: {
    backgroundColor: '#ECEEF2',
    borderColor: '#D1D5DB',
  },
  textInput: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: FontSize.base,
    color: Palette.dark,
    height: '100%',
    paddingVertical: 0,
  },
  textInputDisabled: {
    color: '#6B7280',
    fontWeight: FontWeight.medium,
  },
  lockIconBadge: {
    paddingLeft: 6,
  },
  saveButton: {
    marginTop: 6,
  },
  passwordButton: {
    marginTop: 6,
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
});
