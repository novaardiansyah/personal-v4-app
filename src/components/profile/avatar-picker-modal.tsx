import React from 'react';
import { Modal, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, CommonStyles, FontSize, FontWeight, Fonts, Palette } from '@/constants/theme';
import { CameraIcon, ImageIcon, TrashIcon } from '@/components/icons';

interface AvatarPickerModalProps {
  visible: boolean;
  avatarPreview: string | null;
  onClose: () => void;
  onPickCamera: () => void;
  onPickGallery: () => void;
  onRemoveAvatar: () => void;
}

export function AvatarPickerModal({
  visible,
  avatarPreview,
  onClose,
  onPickCamera,
  onPickGallery,
  onRemoveAvatar,
}: AvatarPickerModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContent,
                {
                  paddingBottom: Math.max(insets.bottom, 24) + 20,
                },
              ]}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHandle} />
                <ThemedText style={styles.modalTitle}>Foto Profil</ThemedText>
                <ThemedText style={styles.modalSubtitle}>
                  Pilih sumber foto untuk memperbarui foto profil Anda
                </ThemedText>
              </View>

              <View style={styles.modalOptions}>
                <Pressable
                  style={({ pressed }) => [styles.modalOptionItem, pressed && CommonStyles.pressed]}
                  onPress={onPickCamera}>
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
                  onPress={onPickGallery}>
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
                    onPress={onRemoveAvatar}>
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

              <Pressable
                style={({ pressed }) => [styles.modalCancelBtn, pressed && CommonStyles.pressed]}
                onPress={onClose}>
                <ThemedText style={styles.modalCancelText}>Batal</ThemedText>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Palette.card,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.borderDark,
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Palette.dark,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    color: Palette.secondary,
    textAlign: 'center',
  },
  modalOptions: {
    gap: 8,
    marginBottom: 16,
  },
  modalOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: BorderRadius.xl,
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: 14,
  },
  modalOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOptionTextWrapper: {
    flex: 1,
    gap: 2,
  },
  modalOptionTitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Palette.dark,
  },
  modalOptionDesc: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs + 0.5,
    color: Palette.secondary,
  },
  modalCancelBtn: {
    height: 46,
    borderRadius: BorderRadius.lg,
    backgroundColor: Palette.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Palette.secondary,
  },
});
