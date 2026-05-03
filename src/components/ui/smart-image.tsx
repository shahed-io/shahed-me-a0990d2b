import { ImgHTMLAttributes, useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Append a build-time version query so browsers/CDNs fetch a fresh copy
 * after each deploy. Only applies to http(s) URLs we control, and only
 * when the URL has no existing version/hash query.
 */
const BUILD_ID =
  typeof __BUILD_ID__ !== "undefined" ? __BUILD_ID__ : "dev";

export const withCacheBust = (url?: string): string | undefined => {
  if (!url) return url;
  // Skip data:, blob:, and URLs that already include a version param.
  if (/^(data:|blob:)/.test(url)) return url;
  if (/[?&](v|version|hash|t)=/.test(url)) return url;
  // Vite-bundled assets already have content hash like "name-abc123.jpg" — skip.
  if (/-[A-Za-z0-9_]{8,}\.[a-z0-9]+($|\?)/i.test(url)) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${BUILD_ID}`;
};

export interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Fallback image URL tried first when the primary src fails. */
  fallbackSrc?: string;
  /** Message shown if both primary and fallback fail to load. */
  fallbackMessage?: string;
  /** Wrapper class for the placeholder state. */
  wrapperClassName?: string;
}

/**
 * <img> with graceful error handling:
 *  1. Tries the original src.
 *  2. Falls back to `fallbackSrc` if provided.
 *  3. Renders a styled placeholder with icon + message if all fail.
 */
export const SmartImage = ({
  src,
  fallbackSrc,
  fallbackMessage = "ছবি লোড করা যায়নি",
  alt,
  className,
  wrapperClassName,
  onError,
  ...rest
}: SmartImageProps) => {
  const [stage, setStage] = useState<"primary" | "fallback" | "failed">(
    "primary",
  );

  const currentSrc = stage === "primary" ? src : fallbackSrc;

  if (stage === "failed" || !currentSrc) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 p-4 text-center text-muted-foreground",
          className,
          wrapperClassName,
        )}
      >
        <ImageOff className="h-6 w-6 opacity-60" aria-hidden />
        <span className="text-xs leading-snug">{fallbackMessage}</span>
      </div>
    );
  }

  return (
    <img
      {...rest}
      src={withCacheBust(currentSrc)}
      alt={alt}
      className={className}
      onError={(e) => {
        if (stage === "primary" && fallbackSrc) {
          setStage("fallback");
        } else {
          setStage("failed");
        }
        onError?.(e);
      }}
    />
  );
};

export default SmartImage;
