export const DEFAULT_ADJUSTMENTS = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  warmth: 0,
  sharpness: 0,
  shadows: 0,
  highlights: 0,
};

const clamp = (value, min = 0, max = 255) =>
  Math.min(max, Math.max(min, value));

const getLuminance = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

function applyPixelAdjustments(imageData, adjustments) {
  const { warmth, shadows, highlights } = adjustments;
  const data = imageData.data;
  const shadowStrength = shadows / 100;
  const highlightStrength = highlights / 100;
  const warmthStrength = warmth / 100;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    if (warmthStrength !== 0) {
      r = clamp(r + warmthStrength * 35);
      b = clamp(b - warmthStrength * 35);
      g = clamp(g + warmthStrength * 8);
    }

    const luminance = getLuminance(r, g, b);

    if (shadowStrength !== 0) {
      const shadowMask = 1 - luminance / 255;
      const lift = shadowStrength * shadowMask * 55;
      r = clamp(r + lift);
      g = clamp(g + lift);
      b = clamp(b + lift);
    }

    if (highlightStrength !== 0) {
      const highlightMask = luminance / 255;
      const recovery = -highlightStrength * highlightMask * 55;
      r = clamp(r + recovery);
      g = clamp(g + recovery);
      b = clamp(b + recovery);
    }

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }
}

function applySharpness(imageData, width, height, amount) {
  if (amount <= 0) return imageData;

  const source = new Uint8ClampedArray(imageData.data);
  const output = imageData.data;
  const strength = amount / 100;
  const kernel = [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0,
  ];

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      for (let channel = 0; channel < 3; channel += 1) {
        let sum = 0;

        for (let ky = -1; ky <= 1; ky += 1) {
          for (let kx = -1; kx <= 1; kx += 1) {
            const pixelIndex = ((y + ky) * width + (x + kx)) * 4 + channel;
            const kernelIndex = (ky + 1) * 3 + (kx + 1);
            sum += source[pixelIndex] * kernel[kernelIndex];
          }
        }

        const currentIndex = (y * width + x) * 4 + channel;
        const sharpened = source[currentIndex] + (sum - source[currentIndex]) * strength;
        output[currentIndex] = clamp(sharpened);
      }
    }
  }

  return imageData;
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

export async function renderAdjustedImage(source, adjustments = DEFAULT_ADJUSTMENTS) {
  const image = await loadImage(source);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;

  ctx.filter = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  ctx.filter = 'none';

  const needsPixelPass =
    adjustments.warmth !== 0 ||
    adjustments.shadows !== 0 ||
    adjustments.highlights !== 0 ||
    adjustments.sharpness > 0;

  if (needsPixelPass) {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (
      adjustments.warmth !== 0 ||
      adjustments.shadows !== 0 ||
      adjustments.highlights !== 0
    ) {
      applyPixelAdjustments(imageData, adjustments);
    }

    if (adjustments.sharpness > 0) {
      imageData = applySharpness(imageData, canvas.width, canvas.height, adjustments.sharpness);
    }

    ctx.putImageData(imageData, 0, 0);
  }

  return canvas;
}

export async function renderAdjustedImageDataUrl(source, adjustments = DEFAULT_ADJUSTMENTS) {
  const canvas = await renderAdjustedImage(source, adjustments);
  return canvas.toDataURL('image/png', 1.0);
}
