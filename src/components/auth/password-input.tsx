import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { CommonStyles, FontSize, Fonts, Palette } from '@/constants/theme';
import { EyeIcon, LockIcon } from '@/components/icons';

interface PasswordInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export function PasswordInput({
  label,
  placeholder = 'Masukkan kata sandi',
  value,
  onChangeText,
  error,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <ThemedText style={CommonStyles.inputLabel}>{label}</ThemedText>
      <View
        style={[
          CommonStyles.inputContainer,
          isFocused && CommonStyles.inputContainerFocused,
          Boolean(error) && CommonStyles.inputContainerError,
        ]}>
        <View style={styles.inputIcon}>
          <LockIcon
            color={
              error
                ? Palette.danger
                : isFocused
                ? Palette.primary
                : Palette.secondary
            }
          />
        </View>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={Palette.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
          hitSlop={8}>
          <EyeIcon visible={showPassword} color={Palette.secondary} />
        </Pressable>
      </View>
      {error ? (
        <ThemedText style={CommonStyles.fieldErrorText}>{error}</ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: FontSize.base,
    color: Palette.dark,
    height: '100%',
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 6,
  },
});
