import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { getArticle } from '@/content/education';
import { useTheme } from '@/hooks/use-theme';

export default function ArticleScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const article = slug ? getArticle(slug) : undefined;

  if (!article) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Not found' }} />
        <ThemedText type="subtitle" style={styles.title}>
          Article not found
        </ThemedText>
        <Button title="Back to Learn" onPress={() => router.replace('/learn')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: article.title }} />
      <ThemedText type="title" style={styles.title}>
        {article.title}
      </ThemedText>
      <ThemedText type="small" style={{ color: theme.textSecondary }}>
        {article.readMinutes} min read
      </ThemedText>

      <View style={styles.sections}>
        {article.sections.map((section, index) => (
          <View key={section.heading ?? `section-${index}`} style={styles.section}>
            {section.heading ? (
              <ThemedText type="smallBold" style={styles.heading}>
                {section.heading}
              </ThemedText>
            ) : null}
            <ThemedText style={styles.body}>{section.body}</ThemedText>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    lineHeight: 34,
    marginTop: Spacing.two,
  },
  sections: {
    gap: Spacing.four,
    marginTop: Spacing.two,
  },
  section: {
    gap: Spacing.two,
  },
  heading: {
    fontSize: 16,
    lineHeight: 22,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
});
