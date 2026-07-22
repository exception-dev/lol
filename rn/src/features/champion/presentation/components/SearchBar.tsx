import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors } from '@/core/theme/theme';

interface SearchBarProps {
  value: string;
  onChangeText(value: string): void;
  onClear(): void;
}

export function SearchBar({ value, onChangeText, onClear }: SearchBarProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.searchIcon} accessibilityElementsHidden>
        ⌕
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={t('champion.searchHint')}
        placeholderTextColor={colors.textSubtle}
        selectionColor={colors.accent}
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        clearButtonMode="never"
      />
      {value.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('champion.clearSearch')}
          hitSlop={10}
          onPress={onClear}
          style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}
        >
          <Text style={styles.clearText}>×</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceRaised,
  },
  searchIcon: {
    width: 24,
    color: colors.textMuted,
    fontSize: 24,
    lineHeight: 26,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 8,
    paddingVertical: 0,
    color: colors.text,
    fontSize: 15,
  },
  clearButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    color: colors.textMuted,
    fontSize: 25,
    lineHeight: 28,
  },
  pressed: {
    opacity: 0.55,
  },
});
