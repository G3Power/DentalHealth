import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { checkImageQuality } from '@/capture/quality';
import { Radii, Spacing } from '@/constants/theme';
import { useIsClient } from '@/hooks/use-is-client';
import { useTheme } from '@/hooks/use-theme';
import { useScan } from '@/state/scan-store';

export default function CaptureScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { startScan } = useScan();
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const [isReady, setIsReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  // Avoid mounting the native camera during static web prerender.
  const hasMounted = useIsClient();

  async function handleCapture() {
    const camera = cameraRef.current;
    if (!camera || !isReady || isCapturing) return;
    setIsCapturing(true);
    try {
      const photo = await camera.takePictureAsync({ quality: 0.6 });
      if (!photo) throw new Error('No photo returned');

      const report = checkImageQuality({ width: photo.width, height: photo.height });
      if (!report.ok) {
        Alert.alert('Let’s retake that', report.issues.map((issue) => issue.message).join('\n'));
        setIsCapturing(false);
        return;
      }

      startScan(
        {
          imageUri: photo.uri,
          width: photo.width,
          height: photo.height,
          capturedAt: Date.now(),
        },
        report,
      );
      router.replace('/review');
    } catch {
      Alert.alert('Camera error', 'Something went wrong taking the photo. Please try again.');
      setIsCapturing(false);
    }
  }

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <Screen>
        <ThemedText type="title" style={styles.permTitle}>
          Camera access
        </ThemedText>
        <ThemedText style={{ color: theme.textSecondary }}>
          To take a guided photo of your mouth, this app needs permission to use your camera. The
          photo is processed on your device for this demo and is not uploaded.
        </ThemedText>
        {permission.canAskAgain ? (
          <Button title="Allow camera" onPress={requestPermission} />
        ) : (
          <ThemedText style={{ color: theme.textSecondary }}>
            Camera permission is turned off. Please enable it in your device settings, then return
            here.
          </ThemedText>
        )}
        <Button title="Go back" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <View style={styles.fill}>
      {hasMounted ? (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
          onCameraReady={() => setIsReady(true)}
        />
      ) : null}

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topBar} pointerEvents="box-none">
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Close camera"
            style={styles.iconButton}
          >
            <ThemedText style={styles.iconText}>✕</ThemedText>
          </Pressable>
        </View>

        <View style={styles.guideArea} pointerEvents="none">
          <View style={styles.guide} />
          <View style={styles.captionScrim}>
            <ThemedText style={styles.caption}>
              Fill the guide with your open mouth, in good, even light.
            </ThemedText>
          </View>
        </View>

        <View style={styles.bottomBar} pointerEvents="box-none">
          <Pressable
            onPress={() => setFacing((prev) => (prev === 'front' ? 'back' : 'front'))}
            accessibilityRole="button"
            accessibilityLabel="Flip camera"
            style={styles.iconButton}
          >
            <ThemedText style={styles.iconText}>⟲</ThemedText>
          </Pressable>

          <Pressable
            onPress={handleCapture}
            disabled={!isReady || isCapturing}
            accessibilityRole="button"
            accessibilityLabel="Take photo"
            style={[styles.shutter, (!isReady || isCapturing) && styles.shutterDisabled]}
          >
            {isCapturing ? <ActivityIndicator color="#000" /> : <View style={styles.shutterInner} />}
          </Pressable>

          <View style={styles.iconButton} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: '#000',
  },
  permTitle: {
    fontSize: 30,
    lineHeight: 36,
    marginTop: Spacing.two,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: Spacing.three,
  },
  guideArea: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  guide: {
    width: '70%',
    aspectRatio: 1.5,
    borderRadius: Radii.pill,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
    borderStyle: 'dashed',
  },
  captionScrim: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radii.md,
    maxWidth: 320,
  },
  caption: {
    color: '#fff',
    textAlign: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
  },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: Radii.pill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 22,
  },
  shutter: {
    width: 76,
    height: 76,
    borderRadius: Radii.pill,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterDisabled: {
    opacity: 0.5,
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: Radii.pill,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#00000022',
  },
});
