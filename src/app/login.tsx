import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonStyles, Palette } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { loginMobileApi } from '@/services/api';
import { CheckIcon, MailIcon } from '@/components/icons';
import { PasswordInput } from '@/components/auth/password-input';
import { styles } from '@/components/auth/login.styles';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const handleLogin = async () => {
    setGeneralError('');
    const clientErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      clientErrors.email = 'Email wajib diisi.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        clientErrors.email = 'Format email tidak valid (contoh: nama@email.com).';
      }
    }

    if (!password) {
      clientErrors.password = 'Kata sandi wajib diisi.';
    } else if (password.length < 6) {
      clientErrors.password = 'Kata sandi minimal 6 karakter.';
    }

    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      const res = await loginMobileApi({
        email: email.trim(),
        password,
      });

      if (!res.success) {
        const serverFieldErrors: { email?: string; password?: string } = {};

        if (res.errors?.email?.[0]) {
          serverFieldErrors.email = res.errors.email[0];
        }
        if (res.errors?.password?.[0]) {
          serverFieldErrors.password = res.errors.password[0];
        }

        if (Object.keys(serverFieldErrors).length > 0) {
          setFieldErrors(serverFieldErrors);
        } else {
          setGeneralError(res.message || 'Login gagal. Periksa kembali email dan kata sandi Anda.');
        }
        return;
      }

      if (res.data) {
        await login(
          {
            id: res.data.user.id,
            name: res.data.user.name,
            email: res.data.user.email,
            avatar_url: res.data.user.avatar_url,
            token: res.data.token,
            expires_at: res.data.expires_at,
          },
          res.data.expires_at
        );
        router.replace('/');
      }
    } catch {
      setGeneralError('Terjadi kesalahan koneksi. Silakan periksa jaringan Anda dan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={CommonStyles.screenContainer}>
      <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={CommonStyles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <ThemedText style={styles.title}>Selamat Datang</ThemedText>
              <ThemedText style={styles.subtitle} themeColor="textSecondary">
                Masuk ke akun Anda untuk memulai sesi Anda.
              </ThemedText>
            </View>

            {generalError ? (
              <View style={styles.errorBanner}>
                <ThemedText style={styles.errorText}>{generalError}</ThemedText>
              </View>
            ) : null}

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <ThemedText style={CommonStyles.inputLabel}>Email</ThemedText>
                <View
                  style={[
                    CommonStyles.inputContainer,
                    emailFocused && CommonStyles.inputContainerFocused,
                    Boolean(fieldErrors.email) && CommonStyles.inputContainerError,
                  ]}>
                  <View style={styles.inputIcon}>
                    <MailIcon color={fieldErrors.email ? Palette.danger : emailFocused ? Palette.primary : Palette.secondary} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="nama@email.com"
                    placeholderTextColor={Palette.textMuted}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                      if (generalError) setGeneralError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </View>
                {fieldErrors.email ? (
                  <ThemedText style={CommonStyles.fieldErrorText}>{fieldErrors.email}</ThemedText>
                ) : null}
              </View>

              <PasswordInput
                label="Kata Sandi"
                placeholder="Masukkan kata sandi"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  if (generalError) setGeneralError('');
                }}
                error={fieldErrors.password}
              />

              <View style={CommonStyles.rowBetween}>
                <Pressable
                  style={styles.checkboxRow}
                  onPress={() => setRememberMe(!rememberMe)}>
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxActive,
                    ]}>
                    {rememberMe ? <CheckIcon /> : null}
                  </View>
                  <ThemedText style={styles.checkboxLabel} themeColor="textSecondary">
                    Ingat saya
                  </ThemedText>
                </Pressable>

                <Pressable onPress={() => setGeneralError('Fitur reset kata sandi sedang dalam pengembangan.')}>
                  <ThemedText style={styles.forgotPassword}>Lupa Sandi?</ThemedText>
                </Pressable>
              </View>

              <Pressable
                style={({ pressed }) => [
                  CommonStyles.buttonPrimary,
                  pressed && CommonStyles.buttonPrimaryPressed,
                  isLoading && CommonStyles.buttonPrimaryDisabled,
                ]}
                onPress={handleLogin}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color={Palette.white} size="small" />
                ) : (
                  <Text style={CommonStyles.buttonPrimaryText}>Masuk</Text>
                )}
              </Pressable>
            </View>

            <View style={styles.footer}>
              <ThemedText style={styles.footerText} themeColor="textSecondary">
                Belum punya akun?{' '}
              </ThemedText>
              <Pressable onPress={() => router.push('/register')}>
                <ThemedText style={styles.registerLink}>Daftar Sekarang</ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}
