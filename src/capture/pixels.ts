import type { ExtractLumaOptions, LumaImage } from './luma';

/**
 * Native pixel source — placeholder for now.
 *
 * Returns `null` on native, so the capture flow falls back to the
 * resolution-only quality check (unchanged on-device behavior). Activating the
 * brightness/sharpness checks here needs a step that decodes the captured photo
 * to raw pixels. Options, cheapest first:
 *   - `@shopify/react-native-skia`: `Skia.Image.MakeImageFromEncoded(...)` then
 *     `readPixels()` — robust, but a heavy dependency for a quality gate.
 *   - A tiny native module returning a downsampled luma buffer.
 *   - `expo-image-manipulator` to resize + a JS decoder for the small result.
 *
 * Whatever the source, downsample to `options.maxDimension` and return the same
 * `LumaImage` shape as `pixels.web.ts` — the rest of the pipeline is identical.
 */
export function extractLuma(
  _uri: string,
  _options?: ExtractLumaOptions,
): Promise<LumaImage | null> {
  return Promise.resolve(null);
}
