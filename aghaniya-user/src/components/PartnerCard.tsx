import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

type Partner = {
  name: string;
  logo: string;
};

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return { r, g, b };
}

function relativeLuminance(r: number, g: number, b: number) {
  // convert sRGB to linear
  const srgb = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function readableTextColor(hex: string) {
  try {
    const { r, g, b } = hexToRgb(hex);
    const L = relativeLuminance(r, g, b);
    const whiteContrast = (1.0 + 0.05) / (L + 0.05);
    const blackContrast = (L + 0.05) / (0.0 + 0.05);
    // prefer higher contrast; WCAG recommends 4.5:1 for normal text
    return whiteContrast >= blackContrast ? '#ffffff' : '#000000';
  } catch (e) {
    return '#000000';
  }
}

export default function PartnerCard({ partner }: { partner: Partner }) {
  const [color, setColor] = useState<string>('#e5e7eb');
  const [errored, setErrored] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    function computeColor() {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx || !img) return;

        // downscale to 8x8 to average quickly
        const size = 8;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        setColor(hex);
      } catch (e) {
        // silently ignore canvas/cors errors
      }
    }

    if (img.complete && img.naturalWidth !== 0) {
      computeColor();
    } else {
      img.addEventListener('load', computeColor);
      img.addEventListener('error', () => setErrored(true));
      return () => {
        img.removeEventListener('load', computeColor);
      };
    }
  }, [partner.logo]);

  return (
    <Card
      className={`p-4 text-center hover:shadow-md transition-shadow cursor-pointer bg-white`}
      style={{ boxShadow: `0 8px 24px ${color}33`, borderTop: `4px solid ${color}22` }}
    >
      <CardContent className="flex items-center justify-center h-24 p-2">
        {!errored ? (
          <img
            ref={imgRef}
            src={partner.logo}
            alt={partner.name}
            className="max-h-16 max-w-full object-contain transition-transform duration-300 hover:scale-105"
            loading="lazy"
            crossOrigin="anonymous"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('placeholder-img.svg')) {
                target.src = '/assets/placeholder-img.svg';
                return;
              }
              setErrored(true);
            }}
          />
        ) : (
          <span
            className="fallback-text text-xs font-semibold px-2 py-1 rounded"
            style={{ backgroundColor: color, color: readableTextColor(color) }}
          >
            {partner.name}
          </span>
        )}
      </CardContent>
    </Card>
  );
}
