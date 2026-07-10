import {
  DEFAULT_MAX_LUMA_DIM,
  fitScale,
  rgbaToLuma,
  type ExtractLumaOptions,
  type LumaImage,
} from './luma';

function loadImage(uri: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Captured photos are local (data:/blob:) so this is same-origin; set for
    // the http(s) case so a CORS-enabled source stays readable via getImageData.
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load captured image'));
    img.src = uri;
  });
}

/**
 * Web pixel source: draw the captured photo to a downsampled canvas and read
 * back a luma buffer. Never throws into the capture flow — any failure (no DOM,
 * a tainted canvas, a decode error) resolves to `null`, and the caller falls
 * back to the resolution-only check.
 */
export async function extractLuma(
  uri: string,
  options?: ExtractLumaOptions,
): Promise<LumaImage | null> {
  if (typeof document === 'undefined') return null;
  const maxDimension = options?.maxDimension ?? DEFAULT_MAX_LUMA_DIM;

  try {
    const img = await loadImage(uri);
    const sourceWidth = img.naturalWidth || img.width;
    const sourceHeight = img.naturalHeight || img.height;
    if (!sourceWidth || !sourceHeight) return null;

    const scale = fitScale(sourceWidth, sourceHeight, maxDimension);
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(img, 0, 0, width, height);
    const { data } = ctx.getImageData(0, 0, width, height);
    return { luma: rgbaToLuma(data), width, height };
  } catch {
    return null;
  }
}
