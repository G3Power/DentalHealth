import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
}

export function Checkbox({ checked, onToggle, label }: CheckboxProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={styles.row}
    >
      <View
        style={[
          styles.box,
          {
            borderColor: checked ? theme.primary : theme.border,
            backgroundColor: checked ? theme.primary : 'transparent',
          },
        ]}
      >
        {checked ? (
          <ThemedText style={[styles.tick, { color: theme.onPrimary }]}>✓</ThemedText>
        ) : null}
      </View>
      <ThemedText style={styles.label}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  box: {
    width: 26,
    height: 26,
    borderRadius: Radii.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  tick: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 18,
  },
  label: {
    flex: 1,
  },
});
