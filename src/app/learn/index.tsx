import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { EDUCATION_ARTICLES } from '@/content/education';
import { useTheme } from '@/hooks/use-theme';

export default function LearnScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Screen>
      <ThemedText type="default" style={{ color: theme.textSecondary }}>
        Short, plain-language reads on what your mouth can reveal — and how to look after it.
      </ThemedText>

      <View style={styles.list}>
        {EDUCATION_ARTICLES.map((article) => (
          <Pressable
            key={article.slug}
            onPress={() => router.push({ pathname: '/learn/[slug]', params: { slug: article.slug } })}
            accessibilityRole="button"
          >
            <Card style={styles.card}>
              <ThemedText type="smallBold" style={styles.cardTitle}>
                {article.title}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                {article.summary}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.primary }}>
                {article.readMinutes} min read ›
              </ThemedText>
            </Card>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.three,
  },
  card: {
    gap: Spacing.two,
  },
  cardTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
});
