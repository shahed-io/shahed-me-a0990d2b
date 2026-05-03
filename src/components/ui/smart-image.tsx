import { ImgHTMLAttributes, useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

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
      src={currentSrc}
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
