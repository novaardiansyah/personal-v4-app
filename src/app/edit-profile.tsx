import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  BorderRadius,
  CommonStyles,
  FontSize,
  FontWeight,
  Fonts,
  Palette,
  Shadows,
  Spacing,
} from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import {
  changePasswordMobileApi,
  getProfileMobileApi,
  updateProfileMobileApi,
} from '@/services/api';
import { pickImageFromCamera, pickImageFromGallery } from '@/utils/image-picker';

// --- Vector Icons ---
function ArrowLeftIcon({ color = Palette.dark, size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 19l-7-7 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CameraIcon({ color = Palette.white, size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ImageIcon({ color = Palette.primary, size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="8.5" cy="8.5" r="1.5" fill={color} />
      <Path d="M21 15l-5-5L5 21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function UserIcon({ color = Palette.secondary, size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MailIcon({ color = Palette.secondary, size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M22 7L12 13L2 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function LockIcon({ color = Palette.secondary, size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function EyeIcon({ visible, size = 18, color = Palette.secondary }: { visible: boolean; size?: number; color?: string }) {
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

function TrashIcon({ color = Palette.danger, size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 6h18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function KeyIcon({ color = Palette.primary, size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="7.5" cy="15.5" r="5.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M11.4 11.6L21 2M16 7l2 2M19 4l2 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateUser, isAuthenticated } = useAuth();
  const navigateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Profile data states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar_url || null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

  // Avatar action modal state
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);

  // Profile submission & loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{ name?: string }>({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Change Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPasswordFocused, setCurrentPasswordFocused] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{
    current_password?: string;
    new_password?: string;
    new_password_confirmation?: string;
  }>({});
  const [passwordGeneralError, setPasswordGeneralError] = useState('');
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');

  // Clear transient alert messages and errors on focus and blur/unmount
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

  // Fetch latest profile on load
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

  // Gallery Picker handler
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

  // Camera Picker handler
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

  // Remove Avatar handler
  const handleRemoveAvatar = () => {
    setIsAvatarModalVisible(false);
    setAvatarPreview(null);
    setAvatarBase64(null);
  };

  // Back Navigation handler
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

  // Save Profile (Name & Avatar)
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
        updateUser({
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

  // Change Password Submission
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
        updateUser({
          token: res.data.token,
          name: res.data.user?.name,
          email: res.data.user?.email,
          avatar_url: res.data.user?.avatar_url,
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
            {/* Top Navigation Bar */}
            <View style={styles.topBar}>
              <Pressable
                style={({ pressed }) => [styles.backButton, pressed && CommonStyles.pressed]}
                onPress={handleBack}>
                <ArrowLeftIcon size={20} color={Palette.dark} />
              </Pressable>
              <ThemedText style={styles.topBarTitle}>Profile Saya</ThemedText>
              <View style={styles.placeholderButton} />
            </View>

            {/* Notification Banners */}
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

            {/* Avatar Section Card */}
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

            {/* Form Fields Card: Data Pribadi */}
            <View style={styles.formCard}>
              <ThemedText style={styles.sectionTitle}>Data Pribadi</ThemedText>

              {/* Name Input */}
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

              {/* Email Input (Disabled / Read-Only) */}
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

              {/* Save Profile Button */}
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

            {/* Form Fields Card: Ganti Kata Sandi */}
            <View style={[styles.formCard, styles.passwordCard]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardHeaderIcon}>
                  <KeyIcon size={18} color={Palette.primary} />
                </View>
                <ThemedText style={styles.sectionTitle}>Ganti Kata Sandi</ThemedText>
              </View>

              {/* Password Feedback Banners */}
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

              {/* Current Password */}
              <View style={styles.inputGroup}>
                <ThemedText style={CommonStyles.inputLabel}>Kata Sandi Saat Ini</ThemedText>
                <View
                  style={[
                    CommonStyles.inputContainer,
                    currentPasswordFocused && CommonStyles.inputContainerFocused,
                    Boolean(passwordErrors.current_password) && CommonStyles.inputContainerError,
                  ]}>
                  <View style={styles.inputIcon}>
                    <LockIcon color={passwordErrors.current_password ? Palette.danger : currentPasswordFocused ? Palette.primary : Palette.secondary} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Masukkan kata sandi saat ini"
                    placeholderTextColor={Palette.textMuted}
                    value={currentPassword}
                    onChangeText={(text) => {
                      setCurrentPassword(text);
                      if (passwordErrors.current_password) setPasswordErrors((prev) => ({ ...prev, current_password: undefined }));
                      if (passwordGeneralError) setPasswordGeneralError('');
                    }}
                    secureTextEntry={!showCurrentPassword}
                    autoCapitalize="none"
                    onFocus={() => setCurrentPasswordFocused(true)}
                    onBlur={() => setCurrentPasswordFocused(false)}
                  />
                  <Pressable
                    style={styles.eyeButton}
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                    <EyeIcon visible={showCurrentPassword} size={18} color={Palette.secondary} />
                  </Pressable>
                </View>
                {passwordErrors.current_password ? (
                  <ThemedText style={CommonStyles.fieldErrorText}>{passwordErrors.current_password}</ThemedText>
                ) : null}
              </View>

              {/* New Password */}
              <View style={styles.inputGroup}>
                <ThemedText style={CommonStyles.inputLabel}>Kata Sandi Baru</ThemedText>
                <View
                  style={[
                    CommonStyles.inputContainer,
                    newPasswordFocused && CommonStyles.inputContainerFocused,
                    Boolean(passwordErrors.new_password) && CommonStyles.inputContainerError,
                  ]}>
                  <View style={styles.inputIcon}>
                    <LockIcon color={passwordErrors.new_password ? Palette.danger : newPasswordFocused ? Palette.primary : Palette.secondary} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Minimal 6 karakter"
                    placeholderTextColor={Palette.textMuted}
                    value={newPassword}
                    onChangeText={(text) => {
                      setNewPassword(text);
                      if (passwordErrors.new_password) setPasswordErrors((prev) => ({ ...prev, new_password: undefined }));
                      if (passwordGeneralError) setPasswordGeneralError('');
                    }}
                    secureTextEntry={!showNewPassword}
                    autoCapitalize="none"
                    onFocus={() => setNewPasswordFocused(true)}
                    onBlur={() => setNewPasswordFocused(false)}
                  />
                  <Pressable
                    style={styles.eyeButton}
                    onPress={() => setShowNewPassword(!showNewPassword)}>
                    <EyeIcon visible={showNewPassword} size={18} color={Palette.secondary} />
                  </Pressable>
                </View>
                {passwordErrors.new_password ? (
                  <ThemedText style={CommonStyles.fieldErrorText}>{passwordErrors.new_password}</ThemedText>
                ) : null}
              </View>

              {/* Confirm New Password */}
              <View style={styles.inputGroup}>
                <ThemedText style={CommonStyles.inputLabel}>Konfirmasi Kata Sandi Baru</ThemedText>
                <View
                  style={[
                    CommonStyles.inputContainer,
                    confirmPasswordFocused && CommonStyles.inputContainerFocused,
                    Boolean(passwordErrors.new_password_confirmation) && CommonStyles.inputContainerError,
                  ]}>
                  <View style={styles.inputIcon}>
                    <LockIcon color={passwordErrors.new_password_confirmation ? Palette.danger : confirmPasswordFocused ? Palette.primary : Palette.secondary} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ulangi kata sandi baru"
                    placeholderTextColor={Palette.textMuted}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (passwordErrors.new_password_confirmation) setPasswordErrors((prev) => ({ ...prev, new_password_confirmation: undefined }));
                      if (passwordGeneralError) setPasswordGeneralError('');
                    }}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    onFocus={() => setConfirmPasswordFocused(true)}
                    onBlur={() => setConfirmPasswordFocused(false)}
                  />
                  <Pressable
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <EyeIcon visible={showConfirmPassword} size={18} color={Palette.secondary} />
                  </Pressable>
                </View>
                {passwordErrors.new_password_confirmation ? (
                  <ThemedText style={CommonStyles.fieldErrorText}>{passwordErrors.new_password_confirmation}</ThemedText>
                ) : null}
              </View>

              {/* Change Password Button */}
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

        {/* Modal Bottom Sheet untuk Aksi Avatar */}
        <Modal
          visible={isAvatarModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsAvatarModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setIsAvatarModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.modalContent,
                    {
                      paddingBottom: Math.max(insets.bottom, 24) + 20,
                    },
                  ]}>
                  {/* Modal Header */}
                  <View style={styles.modalHeader}>
                    <View style={styles.modalHandle} />
                    <ThemedText style={styles.modalTitle}>Foto Profil</ThemedText>
                    <ThemedText style={styles.modalSubtitle}>
                      Pilih sumber foto untuk memperbarui foto profil Anda
                    </ThemedText>
                  </View>

                  {/* Options List */}
                  <View style={styles.modalOptions}>
                    <Pressable
                      style={({ pressed }) => [styles.modalOptionItem, pressed && CommonStyles.pressed]}
                      onPress={handlePickCamera}>
                      <View style={[styles.modalOptionIcon, { backgroundColor: Palette.primaryLight }]}>
                        <CameraIcon size={20} color={Palette.primary} />
                      </View>
                      <View style={styles.modalOptionTextWrapper}>
                        <ThemedText style={styles.modalOptionTitle}>Ambil Foto (Kamera)</ThemedText>
                        <ThemedText style={styles.modalOptionDesc}>Gunakan kamera untuk mengambil foto baru</ThemedText>
                      </View>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [styles.modalOptionItem, pressed && CommonStyles.pressed]}
                      onPress={handlePickGallery}>
                      <View style={[styles.modalOptionIcon, { backgroundColor: Palette.primaryLight }]}>
                        <ImageIcon size={20} color={Palette.primary} />
                      </View>
                      <View style={styles.modalOptionTextWrapper}>
                        <ThemedText style={styles.modalOptionTitle}>Pilih dari Galeri</ThemedText>
                        <ThemedText style={styles.modalOptionDesc}>Pilih gambar yang sudah ada di penyimpanan</ThemedText>
                      </View>
                    </Pressable>

                    {avatarPreview ? (
                      <Pressable
                        style={({ pressed }) => [styles.modalOptionItem, pressed && CommonStyles.pressed]}
                        onPress={handleRemoveAvatar}>
                        <View style={[styles.modalOptionIcon, { backgroundColor: Palette.dangerBg }]}>
                          <TrashIcon size={20} color={Palette.danger} />
                        </View>
                        <View style={styles.modalOptionTextWrapper}>
                          <ThemedText style={[styles.modalOptionTitle, { color: Palette.danger }]}>
                            Hapus Foto Profil
                          </ThemedText>
                          <ThemedText style={styles.modalOptionDesc}>Kembalikan foto profil ke inisial nama</ThemedText>
                        </View>
                      </Pressable>
                    ) : null}
                  </View>

                  {/* Cancel Button */}
                  <Pressable
                    style={({ pressed }) => [styles.modalCancelBtn, pressed && CommonStyles.pressed]}
                    onPress={() => setIsAvatarModalVisible(false)}>
                    <ThemedText style={styles.modalCancelText}>Batal</ThemedText>
                  </Pressable>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
    height: 40,
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
    backgroundColor: Palette.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    marginBottom: Spacing.three,
    ...Shadows.sm,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: Spacing.two,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: Palette.primary,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Palette.white,
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.primary,
    borderWidth: 2,
    borderColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeAvatarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    marginTop: 4,
  },
  changeAvatarBtnText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs + 1,
    fontWeight: FontWeight.semibold,
    color: Palette.primary,
  },
  formCard: {
    backgroundColor: Palette.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: 16,
    marginBottom: Spacing.three,
    ...Shadows.sm,
  },
  passwordCard: {
    borderColor: Palette.border,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: -4,
  },
  cardHeaderIcon: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.sm,
    backgroundColor: Palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Palette.dark,
  },
  inputGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disabledBadge: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs,
    color: Palette.secondary,
    backgroundColor: Palette.muted,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputContainerDisabled: {
    backgroundColor: '#ECEEF2',
    borderColor: '#D1D5DB',
  },
  textInputDisabled: {
    color: '#6B7280',
    fontWeight: FontWeight.medium,
  },
  lockIconBadge: {
    paddingLeft: 6,
  },
  eyeButton: {
    padding: 6,
    marginLeft: 4,
  },
  saveButton: {
    marginTop: Spacing.two,
  },
  passwordButton: {
    backgroundColor: Palette.dark,
    marginTop: Spacing.two,
  },

  /* Modal Bottom Sheet Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Palette.card,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two + 4,
    paddingBottom: Platform.OS === 'ios' ? Spacing.six : Spacing.four,
    gap: 16,
  },
  modalHeader: {
    alignItems: 'center',
    gap: 4,
  },
  modalHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.border,
    marginBottom: 8,
  },
  modalTitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Palette.dark,
  },
  modalSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs + 1,
    color: Palette.secondary,
    textAlign: 'center',
  },
  modalOptions: {
    gap: 10,
    marginTop: 4,
  },
  modalOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  modalOptionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOptionTextWrapper: {
    flex: 1,
    gap: 2,
  },
  modalOptionTitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.semibold,
    color: Palette.dark,
  },
  modalOptionDesc: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs,
    color: Palette.secondary,
  },
  modalCancelBtn: {
    backgroundColor: Palette.muted,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: Platform.OS === 'android' ? 10 : 0,
  },
  modalCancelText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.semibold,
    color: Palette.secondary,
  },
});
